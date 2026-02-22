import { NextResponse } from "next/server";
import { getGraphQL } from "@/app/api/github";
import { PRODUCT_ID } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Tables } from "@/types/supabase";

type CreateRefResponse = {
  createRef: {
    ref: {
      name: string;
    };
  };
};

type CreateCommitResponse = {
  createCommitOnBranch: {
    commit: {
      oid: string;
    };
  };
};

type CreatePullRequestResponse = {
  createPullRequest: {
    pullRequest: {
      number: number;
      url: string;
      id: string;
    };
  };
};

type CreateLabelResponse = {
  createLabel: {
    label: {
      id: string;
    };
  };
};

type RepoInfoResponse = {
  repository: {
    id: string;
    defaultBranchRef: {
      name: string;
      target: {
        oid: string;
      };
    };
    labels?: {
      nodes: Array<{
        id: string;
        name: string;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
};

// Keep in sync with gitauto: utils/generate_branch_name.py generate_branch_name()
function generateBranchName(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.toISOString().slice(11, 19).replace(/:/g, "");
  const random = Math.random().toString(36).slice(2, 6);
  return `${PRODUCT_ID}/dashboard-${date}-${time}-${random}`;
}

// Keep in sync with gitauto: utils/text/text_copy.py git_command()
function gitCommand(branchName: string): string {
  return `\n\n## Test these changes locally\n\n\`\`\`\ngit fetch origin\ngit checkout ${branchName}\ngit pull origin ${branchName}\n\`\`\``;
}

export async function POST(request: Request) {
  try {
    const { selectedCoverages, ownerName, repoName, accessToken, hasLabel } = await request.json();

    if (!selectedCoverages?.length || !ownerName || !repoName || !accessToken) {
      console.error("Missing parameters:", {
        hasCoverages: !!selectedCoverages?.length,
        hasOwner: !!ownerName,
        hasRepo: !!repoName,
        hasToken: !!accessToken,
      });
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const graphqlClient = getGraphQL(accessToken);

    // Get repository Node ID, default branch info, and label ID
    const allLabels: Array<{ id: string; name: string }> = [];
    let hasNextPage = true;
    let endCursor: string | null = null;
    let repositoryId: string | null = null;
    let defaultBranchName: string | null = null;
    let defaultBranchOid: string | null = null;

    while (hasNextPage) {
      const repoInfo: RepoInfoResponse = await graphqlClient<RepoInfoResponse>(
        `
      query getRepoInfo($owner: String!, $name: String!, $labelName: String!, $after: String) {
        repository(owner: $owner, name: $name) {
          id
          defaultBranchRef {
            name
            target {
              oid
            }
          }
          labels(first: 100, query: $labelName, after: $after) {
            nodes {
              id
              name
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
      `,
        { owner: ownerName, name: repoName, labelName: PRODUCT_ID || "", after: endCursor },
      );

      if (!repositoryId) {
        repositoryId = repoInfo.repository.id;
        defaultBranchName = repoInfo.repository.defaultBranchRef.name;
        defaultBranchOid = repoInfo.repository.defaultBranchRef.target.oid;
      }

      const labels = repoInfo.repository.labels?.nodes || [];
      allLabels.push(...labels);
      hasNextPage = repoInfo.repository.labels?.pageInfo.hasNextPage || false;
      endCursor = repoInfo.repository.labels?.pageInfo.endCursor || null;
    }

    // Use target_branch from Supabase if set, otherwise fall back to default branch
    const { data: repoSettings } = await supabaseAdmin
      .from("repositories")
      .select("target_branch, owner_id, repo_id")
      .eq("owner_name", ownerName)
      .eq("repo_name", repoName)
      .maybeSingle();

    let baseBranchName = defaultBranchName;
    let baseBranchOid = defaultBranchOid;

    if (repoSettings?.target_branch) {
      // Verify the target branch exists and get its OID
      try {
        type BranchRefResponse = {
          repository: {
            ref: {
              target: {
                oid: string;
              };
            } | null;
          };
        };
        const branchRef = await graphqlClient<BranchRefResponse>(
          `
          query getBranchRef($owner: String!, $name: String!, $ref: String!) {
            repository(owner: $owner, name: $name) {
              ref(qualifiedName: $ref) {
                target {
                  oid
                }
              }
            }
          }
          `,
          { owner: ownerName, name: repoName, ref: `refs/heads/${repoSettings.target_branch}` },
        );
        if (branchRef.repository.ref) {
          baseBranchName = repoSettings.target_branch;
          baseBranchOid = branchRef.repository.ref.target.oid;
        }
      } catch {
        // Target branch doesn't exist, fall back to default
      }
    }

    // Define label ID
    let labelId =
      hasLabel && PRODUCT_ID ? allLabels?.find((label) => label.name === PRODUCT_ID)?.id : null;

    // If label doesn't exist but is needed, create it
    if (hasLabel && PRODUCT_ID && !labelId) {
      try {
        const createLabelResponse = await graphqlClient<CreateLabelResponse>(
          `
          mutation createLabel($input: CreateLabelInput!) {
            createLabel(input: $input) {
              label {
                id
              }
            }
          }
          `,
          {
            input: {
              repositoryId,
              name: PRODUCT_ID,
              color: "EC4899", // GitAuto brand color (pink)
              description: "PRs to be handled by GitAuto",
            },
          },
        );
        labelId = createLabelResponse.createLabel.label.id;
      } catch (error) {
        console.error("Failed to create label:", error);
      }
    }

    const createdPRs = await Promise.all(
      selectedCoverages.map(async (coverage: Tables<"coverages">) => {
        const {
          full_path,
          line_coverage,
          statement_coverage,
          function_coverage,
          branch_coverage,
          uncovered_lines,
          uncovered_functions,
          uncovered_branches,
          updated_at,
        } = coverage;
        const title = `Low Test Coverage: ${full_path}`;

        const uncoveredLines = uncovered_lines ? `(Uncovered Lines: ${uncovered_lines})` : "";
        const uncoveredFunctions = uncovered_functions
          ? `(Uncovered Functions: ${uncovered_functions})`
          : "";
        const uncoveredBranches = uncovered_branches
          ? `(Uncovered Branches: ${uncovered_branches})`
          : "";

        // 1. Create a branch from base branch
        const branchName = generateBranchName();

        const body = `## File: [${full_path}](https://github.com/${ownerName}/${repoName}/blob/HEAD/${full_path})

- Line Coverage: ${Math.floor(line_coverage || 0)}% ${uncoveredLines}
- Statement Coverage: ${Math.floor(statement_coverage || 0)}%
- Function Coverage: ${Math.floor(function_coverage || 0)}% ${uncoveredFunctions}
- Branch Coverage: ${Math.floor(branch_coverage || 0)}% ${uncoveredBranches}

Last Updated: ${new Date(updated_at).toLocaleString()}

Aim to achieve 100% coverage with minimal code changes. Focus on covering the uncovered areas, including both happy paths, error cases, edge cases, and corner cases. Add to existing test file if available, or create a new one.

## Coverage Dashboard

View full coverage details in the [Coverage Dashboard](${
          ABSOLUTE_URLS.GITAUTO.DASHBOARD.COVERAGE
        }?utm_source=github&utm_medium=referral)${gitCommand(branchName)}`;

        await graphqlClient<CreateRefResponse>(
          `
          mutation createRef($input: CreateRefInput!) {
            createRef(input: $input) {
              ref {
                name
              }
            }
          }
          `,
          {
            input: {
              repositoryId,
              name: `refs/heads/${branchName}`,
              oid: baseBranchOid,
            },
          },
        );

        // 2. Create an empty commit on the branch
        await graphqlClient<CreateCommitResponse>(
          `
          mutation createCommit($input: CreateCommitOnBranchInput!) {
            createCommitOnBranch(input: $input) {
              commit {
                oid
              }
            }
          }
          `,
          {
            input: {
              branch: {
                repositoryNameWithOwner: `${ownerName}/${repoName}`,
                branchName,
              },
              expectedHeadOid: baseBranchOid,
              message: { headline: "Initial empty commit to create PR [skip ci]" },
              fileChanges: {},
            },
          },
        );

        // 3. Create a pull request
        const prResponse = await graphqlClient<CreatePullRequestResponse>(
          `
          mutation createPR($input: CreatePullRequestInput!) {
            createPullRequest(input: $input) {
              pullRequest {
                number
                url
                id
              }
            }
          }
          `,
          {
            input: {
              repositoryId,
              baseRefName: baseBranchName,
              headRefName: branchName,
              title,
              body,
            },
          },
        );

        const pr = prResponse.createPullRequest.pullRequest;

        // 4. Add label to trigger the agent
        if (labelId) {
          await graphqlClient(
            `
            mutation addLabels($input: AddLabelsToLabelableInput!) {
              addLabelsToLabelable(input: $input) {
                clientMutationId
              }
            }
            `,
            {
              input: {
                labelableId: pr.id,
                labelIds: [labelId],
              },
            },
          );
        }

        return {
          coverageId: coverage.id,
          prUrl: pr.url,
        };
      }),
    );

    // Batch update coverage records with PR URLs
    await Promise.all(
      createdPRs.map(({ coverageId, prUrl }) =>
        supabaseAdmin.from("coverages").update({ github_issue_url: prUrl }).eq("id", coverageId),
      ),
    );

    return NextResponse.json({ prs: createdPRs });
  } catch (error) {
    console.error("Error creating PRs:", error);
    return NextResponse.json({ error: "Failed to create PRs" }, { status: 500 });
  }
}

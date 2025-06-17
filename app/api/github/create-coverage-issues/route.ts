import { NextResponse } from "next/server";
import { getGraphQL } from "@/app/api/github";
import { CoverageData } from "@/app/dashboard/coverage/types";
import { PRODUCT_ID } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";
import { supabase } from "@/lib/supabase";

type CreateIssueResponse = {
  createIssue: {
    issue: {
      number: number;
      url: string;
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

type RepoAndLabelResponse = {
  repository: {
    id: string;
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

export async function POST(request: Request) {
  try {
    const { selectedCoverages, ownerName, repoName, accessToken, parentNodeId, hasLabel } =
      await request.json();

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

    // Get repository Node ID and label ID if needed
    let allLabels: Array<{ id: string; name: string }> = [];
    let hasNextPage = true;
    let endCursor: string | null = null;
    let repositoryId: string | null = null;

    while (hasNextPage) {
      const getRepoAndLabel: RepoAndLabelResponse = await graphqlClient<RepoAndLabelResponse>(
        `
      query getRepoAndLabel($owner: String!, $name: String!, $labelName: String!, $after: String) {
        repository(owner: $owner, name: $name) {
          id
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
        { owner: ownerName, name: repoName, labelName: PRODUCT_ID || "", after: endCursor }
      );

      if (!repositoryId) repositoryId = getRepoAndLabel.repository.id;

      const labels = getRepoAndLabel.repository.labels?.nodes || [];
      allLabels.push(...labels);
      hasNextPage = getRepoAndLabel.repository.labels?.pageInfo.hasNextPage || false;
      endCursor = getRepoAndLabel.repository.labels?.pageInfo.endCursor || null;
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
              description: "Issues to be handled by GitAuto",
            },
          }
        );
        labelId = createLabelResponse.createLabel.label.id;
      } catch (error) {
        console.error("Failed to create label:", error);
        // If label creation fails, continue with issue creation
      }
    }

    const createdIssues = await Promise.all(
      selectedCoverages.map(async (coverage: CoverageData) => {
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

        const body = `## File: [${full_path}](https://github.com/${ownerName}/${repoName}/blob/HEAD/${full_path})

- Line Coverage: ${Math.floor(line_coverage)}% ${uncoveredLines}
- Statement Coverage: ${Math.floor(statement_coverage)}%
- Function Coverage: ${Math.floor(function_coverage)}% ${uncoveredFunctions}
- Branch Coverage: ${Math.floor(branch_coverage)}% ${uncoveredBranches}

Last Updated: ${new Date(updated_at).toLocaleString()}

Aim to achieve 100% coverage with minimal code changes. Focus on covering the uncovered areas, including both happy paths, error cases, edge cases, and corner cases. Add to existing test file if available, or create a new one.

## Coverage Dashboard

View full coverage details in the [Coverage Dashboard](${
          ABSOLUTE_URLS.GITAUTO.COVERAGE
        }?utm_source=github&utm_medium=referral)`;

        const response = await graphqlClient<CreateIssueResponse>(
          `
          mutation createIssue($input: CreateIssueInput!) {
            createIssue(input: $input) {
              issue {
                number
                url
              }
            }
          }
        `,
          {
            input: {
              repositoryId,
              title,
              body,
              ...(parentNodeId && { parentIssueId: parentNodeId }),
              ...(labelId && { labelIds: [labelId] }),
            },
          }
        );

        return {
          coverageId: coverage.id,
          issueUrl: response.createIssue.issue.url,
        };
      })
    );

    // Batch update coverage records with issue URLs
    await Promise.all(
      createdIssues.map(({ coverageId, issueUrl }) =>
        supabase.from("coverages").update({ github_issue_url: issueUrl }).eq("id", coverageId)
      )
    );

    return NextResponse.json({ issues: createdIssues });
  } catch (error) {
    console.error("Error creating issues:", error);
    return NextResponse.json({ error: "Failed to create issues" }, { status: 500 });
  }
}

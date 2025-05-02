import { NextResponse } from "next/server";
import { getGraphQL } from "@/app/api/github";
import { CoverageData } from "@/app/dashboard/coverage/types";
import { ABSOLUTE_URLS, PRODUCT_ID } from "@/config";
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
    const getRepoAndLabel = await graphqlClient<{
      repository: {
        id: string;
        labels?: {
          nodes: Array<{
            id: string;
            name: string;
          }>;
        };
      };
    }>(
      `
      query getRepoAndLabel($owner: String!, $name: String!, $labelName: String!) {
        repository(owner: $owner, name: $name) {
          id
          labels(first: 1, query: $labelName) {
            nodes {
              id
              name
            }
          }
        }
      }
      `,
      { owner: ownerName, name: repoName, labelName: PRODUCT_ID || "" }
    );

    const repositoryId = getRepoAndLabel.repository.id;
    const labels = getRepoAndLabel.repository.labels?.nodes;
    console.log("labels: ", labels);
    let labelId =
      hasLabel && PRODUCT_ID ? labels?.find((label) => label.name === PRODUCT_ID)?.id : null;

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
        const title = `Low Test Coverage: ${coverage.full_path}`;

        const uncoveredLines = coverage.uncovered_lines
          ? `(Uncovered Lines: ${coverage.uncovered_lines})`
          : "";
        const uncoveredFunctions = coverage.uncovered_functions
          ? `(Uncovered Functions: ${coverage.uncovered_functions})`
          : "";
        const uncoveredBranches = coverage.uncovered_branches
          ? `(Uncovered Branches: ${coverage.uncovered_branches})`
          : "";

        const body = `## File: ${coverage.full_path}

- Line Coverage: ${Math.floor(coverage.line_coverage)}% ${uncoveredLines}
- Statement Coverage: ${Math.floor(coverage.statement_coverage)}%
- Function Coverage: ${Math.floor(coverage.function_coverage)}% ${uncoveredFunctions}
- Branch Coverage: ${Math.floor(coverage.branch_coverage)}% ${uncoveredBranches}

Last Updated: ${new Date(coverage.updated_at).toLocaleString()}

Aim to achieve 100% coverage with minimal code changes. Focus on covering the uncovered areas, including both happy paths, error cases, edge cases, and corner cases. Add to existing test file if available, or create a new one.

## Coverage Dashboard

View full coverage details in the [Coverage Dashboard](${ABSOLUTE_URLS.GITAUTO.COVERAGES})`;

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

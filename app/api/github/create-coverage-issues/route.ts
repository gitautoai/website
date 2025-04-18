import { NextResponse } from "next/server";
import { getGraphQL } from "@/app/api/github";
import { CoverageData } from "@/app/dashboard/coverage/types";
import { ABSOLUTE_URLS } from "@/config";
import { supabase } from "@/lib/supabase";

type CreateIssueResponse = {
  createIssue: {
    issue: {
      number: number;
      url: string;
    };
  };
};

export async function POST(request: Request) {
  try {
    const { selectedCoverages, ownerName, repoName, accessToken, parentNodeId } =
      await request.json();

    if (!selectedCoverages?.length || !ownerName || !repoName || !accessToken || !parentNodeId) {
      console.error("Missing parameters:", {
        hasCoverages: !!selectedCoverages?.length,
        hasOwner: !!ownerName,
        hasRepo: !!repoName,
        hasToken: !!accessToken,
        hasParentNodeId: !!parentNodeId,
      });
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const graphqlClient = getGraphQL(accessToken);

    // Get repository Node ID
    const getRepoId = await graphqlClient<{ repository: { id: string } }>(
      `
      query getRepoId($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
        }
      }
      `,
      { owner: ownerName, name: repoName }
    );

    const repositoryId = getRepoId.repository.id;

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

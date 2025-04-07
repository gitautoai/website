import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getOctokitForUser } from "@/lib/github";
import { ABSOLUTE_URLS } from "@/config";
import { CoverageData } from "@/app/settings/coverage/types";

export async function POST(request: Request) {
  try {
    const { selectedCoverages, ownerName, repoName, accessToken } = await request.json();

    if (!selectedCoverages?.length || !ownerName || !repoName || !accessToken) {
      console.error("Missing parameters:", {
        hasCoverages: !!selectedCoverages?.length,
        hasOwner: !!ownerName,
        hasRepo: !!repoName,
        hasToken: !!accessToken,
      });
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const octokit = getOctokitForUser(accessToken);

    const createdIssues = await Promise.all(
      selectedCoverages.map(async (coverage: CoverageData) => {
        const title = `Low Test Coverage: ${coverage.full_path}`;
        const body = `## File: ${coverage.full_path}

- Line Coverage: ${Math.floor(coverage.line_coverage)}%
${coverage.uncovered_lines ? `\nUncovered Lines: ${coverage.uncovered_lines}` : ""}
- Statement Coverage: ${Math.floor(coverage.statement_coverage)}%
- Function Coverage: ${Math.floor(coverage.function_coverage)}%
${coverage.uncovered_functions ? `\nUncovered Functions: ${coverage.uncovered_functions}` : ""}
- Branch Coverage: ${Math.floor(coverage.branch_coverage)}%
${coverage.uncovered_branches ? `\nUncovered Branches: ${coverage.uncovered_branches}` : ""}

Last Updated: ${new Date(coverage.updated_at).toLocaleString()}

Write comprehensive test cases to achieve 100% coverage across all metrics (line, statement, function, and branch), including both happy paths, error cases, edge cases, and corner cases. Add to existing test file if available, or create a new one.

## Coverage Dashboard

View full coverage details in the [Coverage Dashboard](${ABSOLUTE_URLS.GITAUTO.COVERAGES})`;

        // https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
        const { data: issue } = await octokit.issues.create({
          owner: ownerName,
          repo: repoName,
          title,
          body,
          // labels: ["coverage"],
          // assignees: ["jason-s-dev"],
        });

        return {
          coverageId: coverage.id,
          issueUrl: issue.html_url,
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

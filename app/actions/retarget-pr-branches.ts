"use server";

import { getOctokitForInstallation } from "@/app/api/github";
import { GITAUTO_API_KEY, GITAUTO_API_URL } from "@/config/gitauto-api";

/**
 * Retarget open GitAuto PRs to a new base branch.
 * Fetches open PRs, then fires one Lambda per PR in parallel.
 * @see /docs/actions/sibling-branch-retarget for why this is needed
 * @see gitauto: main.py api_retarget_pr endpoint
 */
export async function retargetPRBranches(
  ownerName: string,
  repoName: string,
  installationId: number,
  newBaseBranch: string,
) {
  const octokit = await getOctokitForInstallation(installationId);
  const { data: pulls } = await octokit.rest.pulls.list({
    owner: ownerName,
    repo: repoName,
    state: "open",
    per_page: 100,
  });

  if (pulls.length === 0) return { status: "no_open_prs" };

  // Fire one request per PR in parallel — each triggers its own Lambda
  await Promise.all(
    pulls.map(async (pr) => {
      const response = await fetch(`${GITAUTO_API_URL}/api/${ownerName}/${repoName}/retarget_pr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": GITAUTO_API_KEY,
        },
        body: JSON.stringify({
          installation_id: installationId,
          new_base_branch: newBaseBranch,
          pr_number: pr.number,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to retarget PR #${pr.number}: ${response.status}`);
      }
    }),
  );

  return { status: "processing", count: pulls.length };
}

"use server";

import { getOctokitForInstallation } from "@/app/api/github";
import { GITAUTO_API_KEY, GITAUTO_API_URL } from "@/config/gitauto-api";

/**
 * Trigger setup of test coverage GitHub Actions workflow for a repository.
 * Creates a PR with the workflow file if one doesn't already exist.
 * Returns immediately - actual setup happens in background on Lambda.
 */
export async function setupCoverageWorkflow(
  ownerName: string,
  repoName: string,
  installationId: number,
  senderName: string,
) {
  const octokit = await getOctokitForInstallation(installationId);
  const auth = (await octokit.auth({ type: "installation" })) as { token: string };

  const response = await fetch(
    `${GITAUTO_API_URL}/api/${ownerName}/${repoName}/setup_coverage_workflow`,
    {
      method: "POST",
      headers: {
        "X-GitHub-Token": auth.token,
        "X-API-Key": GITAUTO_API_KEY,
        "X-Sender-Name": senderName,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`Error triggering setup: ${response.status} ${error}`);
    throw new Error(`Failed to trigger setup: ${response.status}`);
  }

  return { status: "setup_triggered" };
}

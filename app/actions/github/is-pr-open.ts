"use server";

import { getOctokitForInstallation } from "@/app/api/github";

/**
 * Check if a PR is still open on GitHub.
 * Returns false for closed/merged PRs.
 * On API failure, returns true (conservative - assume open).
 */
export const isPrOpen = async (
  installationId: number,
  ownerName: string,
  repoName: string,
  prNumber: number,
) => {
  try {
    const octokit = await getOctokitForInstallation(installationId);
    const { data } = await octokit.pulls.get({
      owner: ownerName,
      repo: repoName,
      pull_number: prNumber,
    });
    return data.state === "open";
  } catch (error) {
    console.error(
      `Failed to check PR state for ${ownerName}/${repoName}#${prNumber}:`,
      error instanceof Error ? error.message : error,
    );
    return true;
  }
};

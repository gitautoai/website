"use server";

import { slackUs } from "@/app/actions/slack/slack-us";
import { getOctokitForInstallation } from "@/app/api/github";

/**
 * Check if a PR is still open on GitHub.
 * Returns false for closed/merged PRs.
 * On API failure, returns false (skip rather than email about a closed PR).
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
    // 404 is expected for deleted/renamed repos or uninstalled apps — don't spam Slack
    const status = (error as { status?: number }).status;
    console.error(
      `Failed to check PR state for ${ownerName}/${repoName}#${prNumber}:`,
      error instanceof Error ? error.message : error,
    );
    if (status !== 404) {
      await slackUs(
        `❌ Failed to check PR state for ${ownerName}/${repoName}#${prNumber}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return false;
  }
};

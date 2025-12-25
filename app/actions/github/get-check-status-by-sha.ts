"use server";

import { checkCommitHasSkipCI } from "./check-commit-has-skip-ci";
import { getOctokitForInstallation } from "@/app/api/github";

export const getCheckStatusBySHA = async ({
  ownerName,
  repoName,
  installationId,
  sha,
}: {
  ownerName: string;
  repoName: string;
  installationId: number;
  sha: string;
}): Promise<"success" | "failure" | "pending" | "none"> => {
  try {
    const octokit = await getOctokitForInstallation(installationId);

    // Check if last commit has [skip ci] - if yes, tests never ran, NOT passing
    const hasSkipCI = await checkCommitHasSkipCI({
      ownerName,
      repoName,
      installationId,
      sha,
    });
    if (hasSkipCI) return "failure";

    // Get check runs for the commit SHA
    const { data: checkRuns } = await octokit.checks.listForRef({
      owner: ownerName,
      repo: repoName,
      ref: sha,
    });

    // No check runs = no checks configured
    if (checkRuns.check_runs.length === 0) {
      return "none";
    }

    // Check if any are still in progress or queued
    const hasPending = checkRuns.check_runs.some(
      (run) => run.status === "queued" || run.status === "in_progress"
    );
    if (hasPending) {
      return "pending";
    }

    // Check if all completed successfully
    const allSuccess = checkRuns.check_runs.every((run) => run.conclusion === "success");
    if (allSuccess) {
      return "success";
    }

    // Some failed
    return "failure";
  } catch (error) {
    console.error(`Failed to get check status for SHA ${sha}:`, error);
    return "none";
  }
};

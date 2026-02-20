"use server";

import { getOctokitForInstallation } from "@/app/api/github";
import { PRData } from "@/app/dashboard/prs/types";

import { checkCommitHasSkipCI } from "./check-commit-has-skip-ci";

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
}): Promise<PRData["checkStatus"]> => {
  try {
    const octokit = await getOctokitForInstallation(installationId);

    // Check if last commit has [skip ci] - if yes, tests never ran (not a failure)
    const hasSkipCI = await checkCommitHasSkipCI({
      ownerName,
      repoName,
      installationId,
      sha,
    });
    if (hasSkipCI) return "skipped";

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
      (run) => run.status === "queued" || run.status === "in_progress",
    );
    if (hasPending) {
      return "pending";
    }

    // Return the worst conclusion across all check runs (priority order)
    const CONCLUSION_PRIORITY: PRData["checkStatus"][] = [
      "failure",
      "timed_out",
      "cancelled",
      "action_required",
      "stale",
      "success",
      "neutral",
      "skipped",
    ];
    const conclusions = new Set<string | null>(checkRuns.check_runs.map((run) => run.conclusion));
    for (const conclusion of CONCLUSION_PRIORITY) {
      if (conclusions.has(conclusion)) return conclusion;
    }

    return "none";
  } catch (error) {
    console.error(`Failed to get check status for SHA ${sha}:`, error);
    return "none";
  }
};

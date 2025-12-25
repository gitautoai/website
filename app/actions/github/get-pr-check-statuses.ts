"use server";

import { checkCommitHasSkipCI } from "./check-commit-has-skip-ci";
import { getOctokitForInstallation } from "@/app/api/github";

export const getPRCheckStatuses = async ({
  ownerName,
  repoName,
  installationId,
  prNumbers,
}: {
  ownerName: string;
  repoName: string;
  installationId: number;
  prNumbers: number[];
}) => {
  const octokit = await getOctokitForInstallation(installationId);

  const checkStatuses = await Promise.all(
    prNumbers.map(async (prNumber) => {
      try {
        // Get the PR to find the head SHA
        const { data: pr } = await octokit.pulls.get({
          owner: ownerName,
          repo: repoName,
          pull_number: prNumber,
        });

        // Check if last commit has [skip ci] - if yes, tests never ran, NOT passing
        const hasSkipCI = await checkCommitHasSkipCI({
          ownerName,
          repoName,
          installationId,
          sha: pr.head.sha,
        });
        if (hasSkipCI) {
          return {
            prNumber,
            isTestPassed: false,
          };
        }

        // Get check runs for the head commit
        const { data: checkRuns } = await octokit.checks.listForRef({
          owner: ownerName,
          repo: repoName,
          ref: pr.head.sha,
        });

        // PR passes if there are check runs and ALL are successful
        const hasCheckRuns = checkRuns.check_runs.length > 0;
        const allPassed = checkRuns.check_runs.every((run) => run.conclusion === "success");

        return {
          prNumber,
          isTestPassed: hasCheckRuns && allPassed,
        };
      } catch (error) {
        console.error(`Failed to get check status for PR ${prNumber}:`, error);
        return {
          prNumber,
          isTestPassed: false,
        };
      }
    })
  );

  return checkStatuses;
};

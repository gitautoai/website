"use server";

import { getOctokitForInstallation } from "@/app/api/github";

export const updatePRBranches = async ({
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

  const results = await Promise.allSettled(
    prNumbers.map(async (prNumber) => {
      try {
        await octokit.pulls.updateBranch({
          owner: ownerName,
          repo: repoName,
          pull_number: prNumber,
        });
        return { success: true, prNumber, skipped: false };
      } catch (error) {
        // If 422, treat as already up to date (success)
        if ((error as { status?: number }).status === 422) return { success: true, prNumber, skipped: true };

        return {
          success: false,
          prNumber,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    })
  );

  const successful = results.filter(
    (r) => r.status === "fulfilled" && r.value.success && !r.value.skipped
  ).length;
  const skipped = results.filter(
    (r) => r.status === "fulfilled" && r.value.success && r.value.skipped
  ).length;
  const failed = results.filter((r) => r.status === "fulfilled" && !r.value.success).length;

  return {
    total: prNumbers.length,
    successful,
    skipped,
    failed,
  };
};

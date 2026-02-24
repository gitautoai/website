"use server";

import { getOctokitForInstallation } from "@/app/api/github";

/**
 * Get the default branch of a repository.
 * Returns null if the repo is not found (deleted, transferred, or no access).
 */
export async function getDefaultBranch(
  ownerName: string,
  repoName: string,
  installationId: number,
) {
  try {
    const octokit = await getOctokitForInstallation(installationId);

    const { data: repo } = await octokit.rest.repos.get({
      owner: ownerName,
      repo: repoName,
    });

    return repo.default_branch;
  } catch (error) {
    console.error(`Failed to get default branch for ${ownerName}/${repoName}:`, error);
    return null;
  }
}

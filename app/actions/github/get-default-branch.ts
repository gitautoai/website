"use server";

import { getOctokitForInstallation } from "@/app/api/github";

/**
 * Get the default branch of a repository
 */
export async function getDefaultBranch(
  ownerName: string,
  repoName: string,
  installationId: number
): Promise<string> {
  const octokit = await getOctokitForInstallation(installationId);

  const { data: repo } = await octokit.rest.repos.get({
    owner: ownerName,
    repo: repoName,
  });

  return repo.default_branch;
}

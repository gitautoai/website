"use server";

import { getOctokitForUser } from "@/app/api/github";

/**
 * Get the default branch of a repository
 */
export async function getDefaultBranch(
  ownerName: string,
  repoName: string,
  accessToken: string
): Promise<string> {
  const octokit = getOctokitForUser(accessToken);

  const { data: repo } = await octokit.rest.repos.get({
    owner: ownerName,
    repo: repoName,
  });

  return repo.default_branch;
}

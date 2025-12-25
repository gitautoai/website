"use server";

import { getOctokitForInstallation } from "@/app/api/github";

export const checkCommitHasSkipCI = async ({
  ownerName,
  repoName,
  installationId,
  sha,
}: {
  ownerName: string;
  repoName: string;
  installationId: number;
  sha: string;
}): Promise<boolean> => {
  try {
    const octokit = await getOctokitForInstallation(installationId);

    // Get the commit details using the SHA we already have
    const { data: commit } = await octokit.repos.getCommit({
      owner: ownerName,
      repo: repoName,
      ref: sha,
    });

    const commitMessage = commit.commit.message || "";
    return commitMessage.includes("[skip ci]");
  } catch (error) {
    console.error(`Failed to check if commit ${sha} has [skip ci]:`, error);
    return false;
  }
};

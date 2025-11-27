"use server";

import { getOctokitForInstallation } from "@/app/api/github";

export interface RepositoryFile {
  path: string;
  sha: string;
  size: number;
}

/**
 * Fetch all files from a GitHub repository
 */
export async function fetchRepositoryFiles(
  ownerName: string,
  repoName: string,
  installationId: number,
  branch = "main"
) {
  const octokit = await getOctokitForInstallation(installationId);

  try {
    // Get all files recursively in one API call
    const { data } = await octokit.rest.git.getTree({
      owner: ownerName,
      repo: repoName,
      tree_sha: branch,
      recursive: "true",
    });

    const allFiles: RepositoryFile[] = [];

    for (const item of data.tree) {
      if (!item.path || item.type !== "blob") continue;

      allFiles.push({
        path: item.path,
        sha: item.sha!,
        size: item.size || 0,
      });
    }

    return allFiles;
  } catch (error) {
    console.error(`Error fetching repository files:`, error);
    throw error;
  }
}

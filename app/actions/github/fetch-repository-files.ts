"use server";

import { getOctokitForUser } from "@/app/api/github";
import { isCodeFile } from "@/utils/is-code-file";
import { isTestFile } from "@/utils/is-test-file";
import { isTypeFile } from "@/utils/is-type-file";

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
  accessToken: string,
  branch = "main"
) {
  const octokit = getOctokitForUser(accessToken);

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

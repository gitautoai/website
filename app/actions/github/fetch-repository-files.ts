"use server";

import { getOctokitForInstallation } from "@/app/api/github";
import { GITAUTO_API_KEY, GITAUTO_API_URL } from "@/config/gitauto-api";

export interface RepositoryFile {
  path: string;
  sha: string;
  size: number;
}

/**
 * Fetch all files from a GitHub repository via gitauto API.
 * Uses gitauto backend to avoid Vercel's 10s timeout on large repos for hobby plan.
 */
export async function fetchRepositoryFiles(
  ownerName: string,
  repoName: string,
  installationId: number,
  branch: string,
) {
  const octokit = await getOctokitForInstallation(installationId);
  const auth = (await octokit.auth({ type: "installation" })) as { token: string };

  const response = await fetch(
    `${GITAUTO_API_URL}/api/files/${ownerName}/${repoName}?branch=${branch}`,
    {
      headers: {
        "X-GitHub-Token": auth.token,
        "X-API-Key": GITAUTO_API_KEY,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`Error fetching repository files: ${response.status} ${error}`);
    throw new Error(`Failed to fetch repository files: ${response.status}`);
  }

  const files: RepositoryFile[] = await response.json();
  return files;
}

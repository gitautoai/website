"use server";

import { getOctokitForInstallation } from "@/app/api/github";
import { getDefaultBranch } from "@/app/actions/github/get-default-branch";
import { getRepositorySettings } from "@/app/actions/supabase/repositories/get-repository-settings";
import { GITAUTO_API_KEY, GITAUTO_API_URL } from "@/config/gitauto-api";

/**
 * Trigger background sync of repository files from GitHub to coverage database.
 * Returns immediately - actual sync happens in background on Lambda.
 */
export async function syncRepositoryFiles(
  ownerName: string,
  repoName: string,
  ownerId: number,
  repoId: number,
  installationId: number,
  userName: string,
) {
  // Get target branch from repository settings, fall back to GitHub default branch
  const settings = await getRepositorySettings(ownerId, repoId);
  const defaultBranch = await getDefaultBranch(ownerName, repoName, installationId);
  const targetBranch = settings.target_branch || defaultBranch;

  if (!targetBranch) {
    console.error(
      `No branch found for ${ownerName}/${repoName} (repo may be deleted or inaccessible)`,
    );
    throw new Error(`No branch found for ${ownerName}/${repoName}`);
  }

  // Get GitHub token for Lambda to use
  const octokit = await getOctokitForInstallation(installationId);
  const auth = (await octokit.auth({ type: "installation" })) as { token: string };

  const response = await fetch(
    `${GITAUTO_API_URL}/api/${ownerName}/${repoName}/sync_files_from_github_to_coverage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-GitHub-Token": auth.token,
        "X-API-Key": GITAUTO_API_KEY,
      },
      body: JSON.stringify({
        branch: targetBranch,
        owner_id: ownerId,
        repo_id: repoId,
        user_name: userName,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`Error triggering sync: ${response.status} ${error}`);
    throw new Error(`Failed to trigger sync: ${response.status}`);
  }

  return { status: "syncing", branch: targetBranch };
}

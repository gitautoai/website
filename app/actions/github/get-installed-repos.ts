"use server";

import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export interface GitHubOwnerWithRepos {
  ownerId: number;
  ownerName: string;
  ownerType: "User" | "Organization";
  repositories: Array<{ repoId: number; repoName: string }>;
}

// Cache Octokit instances
const octokitCache = new Map<string, Octokit>();

/**
 * Get installed repositories for given installations
 * @param installations - Array of installation objects with ID, owner_id, and owner_name
 * @returns Array of organizations with their repositories
 */
export async function getInstalledRepos(
  installations: Array<{ installation_id: number; owner_id: number; owner_name: string }>
): Promise<GitHubOwnerWithRepos[]> {
  if (!installations || installations.length === 0) return [];

  // Mock for Playwright E2E tests
  if (process.env.IS_PLAYWRIGHT === "true") {
    const result = installations.map((installation) => ({
      ownerId: installation.owner_id,
      ownerName: installation.owner_name,
      ownerType:
        installation.owner_name === "legacy-test-org"
          ? ("Organization" as const)
          : ("User" as const),
      repositories: [
        { repoId: 1, repoName: "test-repo-1" },
        { repoId: 2, repoName: "test-repo-2" },
      ],
    }));
    return result;
  }

  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY;

  if (!appId || !privateKey) {
    console.error("GitHub app credentials are not set");
    throw new Error("GitHub app credentials are not set");
  }

  const organizations = await Promise.all(
    installations.map(async (installation) => {
      const installationId = installation.installation_id;
      const cacheKey = `octokit-${installationId}`;

      let octokit = octokitCache.get(cacheKey);
      if (!octokit) {
        octokit = new Octokit({
          authStrategy: createAppAuth,
          auth: {
            appId: parseInt(appId),
            privateKey: privateKey.replace(/\\n/g, "\n"),
            installationId: installationId,
          },
        });
        octokitCache.set(cacheKey, octokit);
      }

      try {
        const { data: installation } = await octokit.apps.getInstallation({
          installation_id: installationId,
        });

        const { data: repositories } = await octokit.apps.listReposAccessibleToInstallation({
          installation_id: installationId,
          per_page: 100,
        });

        const account = installation.account;
        if (!account) return null;

        return {
          ownerId: account.id,
          ownerName: "login" in account ? account.login : account.name,
          ownerType: "login" in account ? "User" : "Organization",
          repositories: repositories.repositories.map((repo) => ({
            repoId: repo.id,
            repoName: repo.name,
          })),
        };
      } catch (error) {
        console.error(`Error fetching data for installation ${installationId}:`, error);
        return null;
      }
    })
  );

  return organizations.filter((org): org is GitHubOwnerWithRepos => org !== null);
}

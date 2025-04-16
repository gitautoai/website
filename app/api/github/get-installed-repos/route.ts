import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export interface GitHubOwnerWithRepos {
  ownerId: number;
  ownerName: string;
  repositories: Array<{ repoId: number; repoName: string }>;
}

// Cache Octokit instances
const octokitCache = new Map();

const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000;

export async function POST(request: Request) {
  const startTime = performance.now();
  const headers = {
    "Cache-Control": "public, max-age=600, s-maxage=1200, stale-while-revalidate=1800",
  };

  try {
    const { installationIds } = await request.json();
    console.log("installationIds: ", installationIds);

    if (!installationIds || !Array.isArray(installationIds) || installationIds.length === 0) {
      return NextResponse.json({ error: "Valid installation IDs are required" }, { status: 400 });
    }

    // Check if we have a cached response for these exact installation IDs
    const cacheKey = `github-repos-${installationIds.sort().join("-")}`;
    const cachedItem = memoryCache.get(cacheKey);
    console.log({ cacheKey, cachedItem });
    const now = Date.now();

    if (cachedItem && now - cachedItem.timestamp < CACHE_TTL) {
      console.log("Returning cached GitHub repositories data");
      return NextResponse.json(cachedItem.data, { headers });
    }

    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_PRIVATE_KEY;
    console.log({ appId, privateKey });

    if (!appId || !privateKey) {
      console.error("GitHub app credentials are not set");
      return NextResponse.json({ error: "GitHub app credentials are not set" }, { status: 500 });
    }

    const organizations = await Promise.all(
      installationIds.map(async (installationId) => {
        const cacheKey = `octokit-${installationId}`;
        let octokit = octokitCache.get(cacheKey);

        if (!octokit) {
          octokit = new Octokit({
            authStrategy: createAppAuth,
            auth: { appId, privateKey, installationId },
            request: { cache: "no-store" },
          });
          octokitCache.set(cacheKey, octokit);
        }

        try {
          const { data } = await octokit.apps.listReposAccessibleToInstallation({
            installation_id: parseInt(installationId),
            per_page: 100,
          });
          console.log("data: ", data);

          if (!data.repositories.length) return null;

          return {
            ownerId: data.repositories[0].owner.id,
            ownerName: data.repositories[0].owner.login,
            repositories: data.repositories.map((repo: any) => ({
              repoId: repo.id,
              repoName: repo.name,
            })),
          };
        } catch (error) {
          console.error(`Error fetching repos for installation ${installationId}:`, error);
          return null;
        }
      })
    );

    // Filter out null results
    const validOrganizations = organizations.filter((org) => org !== null);
    console.log("validOrganizations: ", validOrganizations);

    // Cache the response
    if (validOrganizations.length > 0) {
      memoryCache.set(cacheKey, {
        data: validOrganizations,
        timestamp: now,
      });
    }

    return NextResponse.json(validOrganizations, { headers });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  } finally {
    const endTime = performance.now();
    console.log(`get-installed-repos execution time: ${endTime - startTime}ms`);
  }
}

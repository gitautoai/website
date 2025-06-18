import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { graphql } from "@octokit/graphql";

// Cache Octokit instances
const octokitCache = new Map<string, Octokit>();

export const getOctokitForInstallation = async (installationId: number) => {
  const cacheKey = `octokit-${installationId}`;
  let octokit = octokitCache.get(cacheKey);

  if (!octokit) {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_PRIVATE_KEY;
    if (!appId || !privateKey) throw new Error("GitHub app credentials are not set");

    octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: { appId, privateKey, installationId },
    });
    octokitCache.set(cacheKey, octokit);
  }

  return octokit;
};

export const getOctokitForUser = (accessToken: string) => {
  const cacheKey = `octokit-user-${accessToken}`;
  let octokit = octokitCache.get(cacheKey);

  if (!octokit) {
    octokit = new Octokit({ auth: accessToken });
    octokitCache.set(cacheKey, octokit);
  }

  return octokit;
};

export const getGraphQL = (accessToken: string) => {
  return graphql.defaults({
    headers: {
      authorization: `token ${accessToken}`,
    },
  });
};

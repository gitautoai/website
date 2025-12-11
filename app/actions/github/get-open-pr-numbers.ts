"use server";

import { getGraphQLForInstallation } from "@/app/api/github";

export type GitAutoPR = {
  number: number;
  title: string;
  url: string;
  headSha: string;
  hasConflicts: boolean;
  createdAt: string;
};

export const getOpenPRNumbers = async ({
  ownerName,
  repoName,
  installationId,
}: {
  ownerName: string;
  repoName: string;
  installationId: number;
}): Promise<GitAutoPR[]> => {
  console.log("getOpenPRNumbers called:", { ownerName, repoName, installationId });

  try {
    const graphql = await getGraphQLForInstallation(installationId);
    // GraphQL returns author.login without [bot] suffix, so remove it for comparison
    const gitautoBotUsername = process.env.GITHUB_APP_USER_NAME?.replace("[bot]", "");

    const { repository } = await graphql<{
      repository: {
        pullRequests: {
          nodes: Array<{
            number: number;
            title: string;
            url: string;
            headRefOid: string;
            mergeable: string;
            createdAt: string;
            author: {
              login: string;
            } | null;
          }>;
        };
      };
    }>(
      `
        query ($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            pullRequests(first: 100, states: OPEN) {
              nodes {
                number
                title
                url
                headRefOid
                mergeable
                createdAt
                author {
                  login
                }
              }
            }
          }
        }
      `,
      {
        owner: ownerName,
        repo: repoName,
      }
    );

    // Filter only PRs created by GitAuto bot
    const gitautoPRs = repository.pullRequests.nodes.filter(
      (pr) => pr.author?.login === gitautoBotUsername
    );

    return gitautoPRs.map((pr) => ({
      number: pr.number,
      title: pr.title,
      url: pr.url,
      headSha: pr.headRefOid,
      hasConflicts: pr.mergeable === "CONFLICTING",
      createdAt: pr.createdAt,
    }));
  } catch (error: any) {
    console.error("getOpenPRNumbers failed:", {
      error: error.message,
      status: error.status,
      ownerName,
      repoName,
      installationId,
    });
    throw error;
  }
};

"use server";

import { getGraphQLForInstallation } from "@/app/api/github";

// Must match: gitauto/services/webhook/setup_handler.py
const SETUP_PR_TITLE = "Set up test coverage workflow";

export type SetupPRStatus =
  | { status: "open"; url: string; number: number; title: string }
  | { status: "closed"; message: string }
  | { status: "none" };

export const getSetupPRStatus = async ({
  ownerName,
  repoName,
  installationId,
}: {
  ownerName: string;
  repoName: string;
  installationId: number;
}): Promise<SetupPRStatus> => {
  console.log("getSetupPRStatus called:", { ownerName, repoName, installationId });

  const graphql = await getGraphQLForInstallation(installationId);
  const gitautoBotUsername = process.env.GITHUB_APP_USER_NAME?.replace("[bot]", "");

  const { repository } = await graphql<{
    repository: {
      openPRs: {
        nodes: Array<{
          number: number;
          title: string;
          url: string;
          author: { login: string } | null;
        }>;
      };
      closedPRs: {
        nodes: Array<{
          number: number;
          title: string;
          url: string;
          author: { login: string } | null;
          comments: {
            nodes: Array<{
              body: string;
              author: { login: string } | null;
            }>;
          };
        }>;
      };
    };
  }>(
    `
      query ($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          openPRs: pullRequests(first: 100, states: OPEN) {
            nodes {
              number
              title
              url
              author {
                login
              }
            }
          }
          closedPRs: pullRequests(
            first: 10
            states: CLOSED
            orderBy: { field: CREATED_AT, direction: DESC }
          ) {
            nodes {
              number
              title
              url
              author {
                login
              }
              comments(last: 1) {
                nodes {
                  body
                  author {
                    login
                  }
                }
              }
            }
          }
        }
      }
    `,
    { owner: ownerName, repo: repoName },
  );

  // Check open PRs first
  const openSetupPR = repository.openPRs.nodes.find(
    (pr) => pr.author?.login === gitautoBotUsername && pr.title.includes(SETUP_PR_TITLE),
  );
  if (openSetupPR) {
    console.log("Found open setup PR:", openSetupPR.url);
    return {
      status: "open",
      url: openSetupPR.url,
      number: openSetupPR.number,
      title: openSetupPR.title,
    };
  }

  // Check closed PRs for bot's closing comment
  const closedSetupPR = repository.closedPRs.nodes.find(
    (pr) => pr.author?.login === gitautoBotUsername && pr.title.includes(SETUP_PR_TITLE),
  );
  if (closedSetupPR) {
    const botComment = closedSetupPR.comments.nodes.find(
      (c) => c.author?.login === gitautoBotUsername,
    );
    if (botComment) {
      console.log("Found closed setup PR with bot comment:", closedSetupPR.url);
      return { status: "closed", message: botComment.body };
    }
  }

  console.log("No setup PR found");
  return { status: "none" };
};

"use server";

import { getGraphQLForInstallation } from "@/app/api/github";
import { ParentIssue } from "@/app/dashboard/coverage/types";

type GetOpenIssuesResponse = {
  repository: {
    issues: {
      nodes: ParentIssue[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
};

/**
 * Get open GitHub issues for parent issue selection
 */
export async function getOpenIssues(
  ownerName: string,
  repoName: string,
  installationId: number
): Promise<ParentIssue[]> {
  const graphqlClient = await getGraphQLForInstallation(installationId);
  const allIssues: ParentIssue[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const response: GetOpenIssuesResponse = await graphqlClient<GetOpenIssuesResponse>(
      `
      query getOpenIssues($owner: String!, $repo: String!, $cursor: String) {
        repository(owner: $owner, name: $repo) {
          issues(states: OPEN, first: 100, after: $cursor) {
            nodes {
              id
              number
              title
              url
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `,
      {
        owner: ownerName,
        repo: repoName,
        cursor,
      }
    );

    allIssues.push(...response.repository.issues.nodes);
    hasNextPage = response.repository.issues.pageInfo.hasNextPage;
    cursor = response.repository.issues.pageInfo.endCursor;
  }

  return allIssues;
}

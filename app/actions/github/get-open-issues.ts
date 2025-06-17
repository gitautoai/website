"use server";

import { getGraphQL } from "@/app/api/github";
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
  accessToken: string
): Promise<ParentIssue[]> {
  const graphqlClient = getGraphQL(accessToken);
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

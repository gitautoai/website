import { NextResponse } from "next/server";
import { getGraphQL } from "@/app/api/github";

type Issue = {
  id: string;
  number: number;
  title: string;
  url: string;
};

type GetOpenIssuesResponse = {
  repository: {
    issues: {
      nodes: Issue[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
};

export async function POST(request: Request) {
  try {
    const { ownerName, repoName, accessToken } = await request.json();

    if (!ownerName || !repoName || !accessToken)
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });

    const graphqlClient = getGraphQL(accessToken);
    const allIssues: Issue[] = [];
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

    return NextResponse.json({
      issues: allIssues.map((issue) => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        html_url: issue.url,
      })),
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

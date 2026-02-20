import { NextResponse } from "next/server";
import { getOctokitForUser } from "@/app/api/github";
import type { RestEndpointMethodTypes } from "@octokit/rest";

type RepoResponse = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];
type BranchResponse = RestEndpointMethodTypes["repos"]["listBranches"]["response"]["data"];

export interface Branch {
  name: string;
  isDefault: boolean;
}

export async function POST(request: Request) {
  try {
    const { ownerName, repoName, accessToken } = await request.json();

    if (!ownerName || !repoName || !accessToken) {
      console.log({ ownerName, repoName, accessToken });
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const octokit = getOctokitForUser(accessToken);

    // Get repository info to determine default branch
    const { data: repo } = (await octokit.repos.get({
      owner: ownerName,
      repo: repoName,
    })) as { data: RepoResponse };

    let allBranches: BranchResponse = [];
    let page = 1;

    while (true) {
      const { data: branches } = (await octokit.repos.listBranches({
        owner: ownerName,
        repo: repoName,
        per_page: 100,
        page,
      })) as { data: BranchResponse };

      if (branches.length === 0) break;

      allBranches = [...allBranches, ...branches];
      page++;
    }

    const formattedBranches = allBranches.map((branch) => ({
      name: branch.name,
      isDefault: branch.name === repo.default_branch,
    }));

    return NextResponse.json(formattedBranches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
  }
}

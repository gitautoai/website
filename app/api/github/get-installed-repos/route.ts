import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export interface GitHubOwnerWithRepos {
  ownerId: number;
  ownerName: string;
  repositories: Array<{ repoId: number; repoName: string }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const installationId = searchParams.get("installationId");
    if (!installationId) {
      console.error("Installation ID is required");
      return NextResponse.json({ error: "Installation ID is required" }, { status: 400 });
    }

    // Create an Octokit instance with App authentication
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_PRIVATE_KEY;
    if (!appId || !privateKey) {
      console.error("GitHub app credentials are not set");
      return NextResponse.json({ error: "GitHub app credentials are not set" }, { status: 500 });
    }
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: { appId, privateKey, installationId: installationId },
    });

    // Get an installation access token
    const {
      data: { token },
    } = await octokit.apps.createInstallationAccessToken({
      installation_id: parseInt(installationId),
    });

    // Create a new Octokit instance with the installation token
    const installationOctokit = new Octokit({ auth: token });

    // Now use this authenticated client to list repositories
    const { data } = await installationOctokit.apps.listReposAccessibleToInstallation({
      installation_id: parseInt(installationId),
      per_page: 100,
    });
    // console.log({ data });

    // Since all repos belong to the same owner, we can take owner info from 0th repo
    const formattedData: GitHubOwnerWithRepos = {
      ownerId: data.repositories[0].owner.id,
      ownerName: data.repositories[0].owner.login,
      repositories: data.repositories.map((repo) => ({
        repoId: repo.id,
        repoName: repo.name,
      })),
    };
    // console.log("formattedData: ", formattedData);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}

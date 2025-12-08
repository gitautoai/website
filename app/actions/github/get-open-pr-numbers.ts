"use server";

import { getOctokitForInstallation } from "@/app/api/github";

export type GitAutoPR = {
  number: number;
  title: string;
  url: string;
  headSha: string;
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
    const octokit = await getOctokitForInstallation(installationId);

    const { data: pullRequests } = await octokit.pulls.list({
      owner: ownerName,
      repo: repoName,
      state: "open",
      per_page: 100,
    });

    // Filter only PRs created by GitAuto bot
    const gitautoBotUsername = process.env.GITHUB_APP_USER_NAME;
    const gitautoPRs = pullRequests.filter((pr) => pr.user?.login === gitautoBotUsername);

    return gitautoPRs.map((pr) => ({
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      headSha: pr.head.sha,
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

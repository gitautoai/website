"use server";

import { getOctokitForInstallation } from "@/app/api/github";

export const getOpenPRNumbers = async ({
  ownerName,
  repoName,
  installationId,
}: {
  ownerName: string;
  repoName: string;
  installationId: number;
}) => {
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

    console.log("getOpenPRNumbers succeeded:", { totalPRs: pullRequests.length, gitautoPRs: gitautoPRs.length });
    return gitautoPRs.map((pr) => pr.number);
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

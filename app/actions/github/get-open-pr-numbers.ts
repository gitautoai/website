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

  return gitautoPRs.map((pr) => pr.number);
};

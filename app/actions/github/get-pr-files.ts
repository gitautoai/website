"use server";

import { getOctokitForInstallation } from "@/app/api/github";

export const getPRFiles = async ({
  ownerName,
  repoName,
  installationId,
  prNumber,
}: {
  ownerName: string;
  repoName: string;
  installationId: number;
  prNumber: number;
}) => {
  const octokit = await getOctokitForInstallation(installationId);

  const { data: files } = await octokit.pulls.listFiles({
    owner: ownerName,
    repo: repoName,
    pull_number: prNumber,
    per_page: 100,
  });

  return files.map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
  }));
};

export type PRFileChange = Awaited<ReturnType<typeof getPRFiles>>[number];

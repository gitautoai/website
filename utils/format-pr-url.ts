export const formatPrUrl = (ownerName: string, repoName: string, prNumber: number) =>
  `https://github.com/${ownerName}/${repoName}/pull/${prNumber}`;

const MIN_BENCHMARK_LINES = 5_000;
const MIN_BENCHMARK_PCT = 80;
const MIN_GAP_PCT = 5;

interface RepoStats {
  ownerId: number;
  repoName: string;
  linesTotal: number;
  coveragePct: number;
}

/**
 * Find a benchmark repo: close-sized, higher coverage (>= 80%, >= 5pp gap),
 * from a different owner. Picks the one closest in lines_total to the target.
 */
export const findBenchmark = (
  targetOwnerId: number,
  targetLinesTotal: number,
  targetCoveragePct: number,
  allRepos: RepoStats[],
): { linesTotal: number; coveragePct: number } | null => {
  let best: RepoStats | null = null;
  let bestDistance = Infinity;

  for (const repo of allRepos) {
    if (repo.ownerId === targetOwnerId) continue;
    if (repo.linesTotal < MIN_BENCHMARK_LINES) continue;
    if (repo.coveragePct < MIN_BENCHMARK_PCT) continue;
    if (repo.coveragePct - targetCoveragePct < MIN_GAP_PCT) continue;

    // Closest in size regardless of direction (bigger or smaller)
    const distance = Math.abs(repo.linesTotal - targetLinesTotal);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = repo;
    }
  }

  if (!best) return null;
  return { linesTotal: best.linesTotal, coveragePct: Math.round(best.coveragePct) };
};

import { findBenchmark } from "./find-benchmark";

const repos = [
  { ownerId: 1, repoName: "a", linesTotal: 30000, coveragePct: 69 },
  { ownerId: 1, repoName: "b", linesTotal: 5300, coveragePct: 89 },
  { ownerId: 1, repoName: "c", linesTotal: 8500, coveragePct: 94 },
  { ownerId: 2, repoName: "d", linesTotal: 7700, coveragePct: 75 },
  { ownerId: 2, repoName: "e", linesTotal: 150000, coveragePct: 15 },
  { ownerId: 3, repoName: "f", linesTotal: 400, coveragePct: 95 },
];

describe("findBenchmark", () => {
  it("picks closest-sized repo from a different owner with >= 80% and >= 5pp gap", () => {
    // Target: owner 2, 7700 lines, 15%. Candidates from owner 1: b (5300, 89%) and c (8500, 94%).
    // c is closer in size (|7700-8500|=800 vs |7700-5300|=2400).
    const result = findBenchmark(2, 7700, 15, repos);
    expect(result).toEqual({ linesTotal: 8500, coveragePct: 94 });
  });

  it("excludes repos from the same owner", () => {
    // Target: owner 1, 5000 lines, 10%. Repo b (5300, 89%) is same owner.
    // Only owner 2's d (7700, 75%) is from a different owner but < 80%, so no match.
    const result = findBenchmark(1, 5000, 10, repos);
    expect(result).toBeNull();
  });

  it("excludes repos below MIN_BENCHMARK_LINES (5000)", () => {
    // Repo f (400 lines, 95%) is too small despite high coverage.
    const result = findBenchmark(2, 500, 10, repos);
    // Should pick from owner 1's b (5300, 89%) or c (8500, 94%). b is closer.
    expect(result).toEqual({ linesTotal: 5300, coveragePct: 89 });
  });

  it("excludes repos below MIN_BENCHMARK_PCT (80%)", () => {
    // Repo a (30000, 69%) and d (7700, 75%) are below 80%.
    // Target: owner 2, 30000 lines, 10%. Only b (5300, 89%) and c (8500, 94%) qualify.
    const result = findBenchmark(2, 30000, 10, repos);
    expect(result).toEqual({ linesTotal: 8500, coveragePct: 94 });
  });

  it("requires at least 5pp gap", () => {
    // Target: owner 2, 5000 lines, 86%. Candidates: b (89%, gap=3pp), c (94%, gap=8pp).
    // b is filtered out by gap. c qualifies.
    const result = findBenchmark(2, 5000, 86, repos);
    expect(result).toEqual({ linesTotal: 8500, coveragePct: 94 });
  });

  it("returns null when no repo qualifies", () => {
    // Target at 95% — needs >= 100%. Nothing qualifies.
    const result = findBenchmark(2, 5000, 95, repos);
    expect(result).toBeNull();
  });

  it("picks closer repo regardless of direction (bigger or smaller)", () => {
    // Target: owner 2, 6000 lines. b (5300, distance=700) vs c (8500, distance=2500).
    // b is closer.
    const result = findBenchmark(2, 6000, 10, repos);
    expect(result).toEqual({ linesTotal: 5300, coveragePct: 89 });
  });
});

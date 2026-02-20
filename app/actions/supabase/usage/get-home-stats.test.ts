import { getHomeStats } from "./get-home-stats";

// Mock supabaseAdmin
const mockFrom = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: (...args: unknown[]) => mockFrom(...args) },
}));

const createCountChain = (count: number | null, error: { message: string } | null = null) => {
  const chain: Record<string, jest.Mock> = {};
  chain.select = jest.fn().mockReturnValue({ count, error });
  return chain;
};

const createDataChain = (data: unknown[] | null, error: { message: string } | null = null) => {
  const result = { data, error };
  const chain: Record<string, jest.Mock> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.not = jest.fn().mockReturnValue(chain);
  chain.gt = jest.fn().mockReturnValue(result);
  return chain;
};

describe("getHomeStats", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return correct stats with deduplicated PRs", async () => {
    const reposChain = createCountChain(50);
    const allPrsChain = createDataChain([
      { owner_name: "Foxquilt", repo_name: "repo1", pr_number: 1 },
      { owner_name: "Foxquilt", repo_name: "repo1", pr_number: 1 }, // duplicate
      { owner_name: "Foxquilt", repo_name: "repo1", pr_number: 2 },
      { owner_name: "OtherOrg", repo_name: "repo2", pr_number: 1 },
    ]);
    const foxPrsChain = createDataChain([
      { repo_name: "repo1", pr_number: 1, is_test_passed: true, is_merged: true },
      { repo_name: "repo1", pr_number: 1, is_test_passed: false, is_merged: false }, // retry
      { repo_name: "repo1", pr_number: 2, is_test_passed: false, is_merged: false },
    ]);

    mockFrom
      .mockReturnValueOnce(reposChain)
      .mockReturnValueOnce(allPrsChain)
      .mockReturnValueOnce(foxPrsChain);

    const result = await getHomeStats();

    expect(result.totalRepos).toBe(50);
    expect(result.totalPrsCreated).toBe(3); // 3 unique PRs
    expect(result.testPassRate).toBe(50); // 1 of 2 Foxquilt PRs passed
    expect(result.mergeRate).toBe(50); // 1 of 2 Foxquilt PRs merged
  });

  it("should treat merged PRs as passed", async () => {
    const reposChain = createCountChain(10);
    const allPrsChain = createDataChain([
      { owner_name: "Foxquilt", repo_name: "repo1", pr_number: 1 },
    ]);
    const foxPrsChain = createDataChain([
      { repo_name: "repo1", pr_number: 1, is_test_passed: false, is_merged: true },
    ]);

    mockFrom
      .mockReturnValueOnce(reposChain)
      .mockReturnValueOnce(allPrsChain)
      .mockReturnValueOnce(foxPrsChain);

    const result = await getHomeStats();

    expect(result.testPassRate).toBe(100);
    expect(result.mergeRate).toBe(100);
  });

  it("should return null rates when no Foxquilt PRs exist", async () => {
    const reposChain = createCountChain(5);
    const allPrsChain = createDataChain([
      { owner_name: "OtherOrg", repo_name: "repo1", pr_number: 1 },
    ]);
    const foxPrsChain = createDataChain([]);

    mockFrom
      .mockReturnValueOnce(reposChain)
      .mockReturnValueOnce(allPrsChain)
      .mockReturnValueOnce(foxPrsChain);

    const result = await getHomeStats();

    expect(result.totalRepos).toBe(5);
    expect(result.totalPrsCreated).toBe(1);
    expect(result.testPassRate).toBeNull();
    expect(result.mergeRate).toBeNull();
  });

  it("should throw on Supabase error for repos", async () => {
    const errorChain = createCountChain(null, { message: "DB error" });
    mockFrom.mockReturnValueOnce(errorChain);

    await expect(getHomeStats()).rejects.toThrow("Failed to fetch repos: DB error");
  });

  it("should throw on Supabase error for all PRs", async () => {
    const reposChain = createCountChain(10);
    const errorChain = createDataChain(null, { message: "DB error" });

    mockFrom.mockReturnValueOnce(reposChain).mockReturnValueOnce(errorChain);

    await expect(getHomeStats()).rejects.toThrow("Failed to fetch total PRs: DB error");
  });

  it("should throw on Supabase error for Foxquilt PRs", async () => {
    const reposChain = createCountChain(10);
    const allPrsChain = createDataChain([]);
    const errorChain = createDataChain(null, { message: "DB error" });

    mockFrom
      .mockReturnValueOnce(reposChain)
      .mockReturnValueOnce(allPrsChain)
      .mockReturnValueOnce(errorChain);

    await expect(getHomeStats()).rejects.toThrow("Failed to fetch Foxquilt PRs: DB error");
  });
});

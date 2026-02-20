import { getHomeStats } from "./get-home-stats";

// Mock supabaseAdmin
const mockFrom = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: (...args: unknown[]) => mockFrom(...args) },
}));

const createChain = (data: unknown[] | null, error: { message: string } | null = null) => {
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
    // First call: all PRs across all customers
    const allPrsChain = createChain([
      { owner_name: "Foxquilt", repo_name: "repo1", pr_number: 1 },
      { owner_name: "Foxquilt", repo_name: "repo1", pr_number: 1 }, // duplicate
      { owner_name: "Foxquilt", repo_name: "repo1", pr_number: 2 },
      { owner_name: "OtherOrg", repo_name: "repo2", pr_number: 1 },
    ]);

    // Second call: Foxquilt PRs for rates
    const foxPrsChain = createChain([
      { repo_name: "repo1", pr_number: 1, is_test_passed: true, is_merged: true },
      { repo_name: "repo1", pr_number: 1, is_test_passed: false, is_merged: false }, // retry
      { repo_name: "repo1", pr_number: 2, is_test_passed: false, is_merged: false },
    ]);

    mockFrom.mockReturnValueOnce(allPrsChain).mockReturnValueOnce(foxPrsChain);

    const result = await getHomeStats();

    expect(result.totalPrsCreated).toBe(3); // 3 unique PRs
    expect(result.testPassRate).toBe(50); // 1 of 2 Foxquilt PRs passed
    expect(result.mergeRate).toBe(50); // 1 of 2 Foxquilt PRs merged
  });

  it("should treat merged PRs as passed", async () => {
    const allPrsChain = createChain([
      { owner_name: "Foxquilt", repo_name: "repo1", pr_number: 1 },
    ]);

    const foxPrsChain = createChain([
      { repo_name: "repo1", pr_number: 1, is_test_passed: false, is_merged: true },
    ]);

    mockFrom.mockReturnValueOnce(allPrsChain).mockReturnValueOnce(foxPrsChain);

    const result = await getHomeStats();

    expect(result.testPassRate).toBe(100);
    expect(result.mergeRate).toBe(100);
  });

  it("should return 0 rates when no Foxquilt PRs exist", async () => {
    const allPrsChain = createChain([
      { owner_name: "OtherOrg", repo_name: "repo1", pr_number: 1 },
    ]);

    const foxPrsChain = createChain([]);

    mockFrom.mockReturnValueOnce(allPrsChain).mockReturnValueOnce(foxPrsChain);

    const result = await getHomeStats();

    expect(result.totalPrsCreated).toBe(1);
    expect(result.testPassRate).toBe(0);
    expect(result.mergeRate).toBe(0);
  });

  it("should throw on Supabase error for all PRs", async () => {
    const errorChain = createChain(null, { message: "DB error" });
    mockFrom.mockReturnValueOnce(errorChain);

    await expect(getHomeStats()).rejects.toThrow("Failed to fetch total PRs: DB error");
  });

  it("should throw on Supabase error for Foxquilt PRs", async () => {
    const allPrsChain = createChain([]);
    const errorChain = createChain(null, { message: "DB error" });

    mockFrom.mockReturnValueOnce(allPrsChain).mockReturnValueOnce(errorChain);

    await expect(getHomeStats()).rejects.toThrow("Failed to fetch Foxquilt PRs: DB error");
  });
});

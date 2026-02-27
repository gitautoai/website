import { getUsageByOwnerIds } from "./get-usage-by-owner-ids";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: jest.fn() },
}));

import { supabaseAdmin } from "@/lib/supabase/server";
const mockFrom = supabaseAdmin.from as jest.Mock;

const chainMock = (data: unknown, error: unknown = null) => {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ["select", "not", "order", "in", "eq", "gt", "is", "limit"])
    chain[m] = jest.fn().mockReturnValue(chain);
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

describe("getUsageByOwnerIds", () => {
  it("returns all usage rows for given owner IDs", async () => {
    const rows = [
      {
        owner_id: 1,
        trigger: "issue",
        owner_name: "org-a",
        repo_name: "api",
        pr_number: 1,
        is_merged: true,
        created_at: "2025-01-01",
      },
      {
        owner_id: 1,
        trigger: "setup",
        owner_name: "org-a",
        repo_name: "api",
        pr_number: 1,
        is_merged: false,
        created_at: "2025-01-02",
      },
    ];
    mockFrom.mockReturnValue(chainMock(rows));

    const result = await getUsageByOwnerIds([1]);

    expect(result).toEqual(rows);
    expect(result).toHaveLength(2);
  });

  it("returns empty array for empty input", async () => {
    mockFrom.mockClear();
    const result = await getUsageByOwnerIds([]);

    expect(result).toEqual([]);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("throws on error", async () => {
    mockFrom.mockReturnValue(chainMock(null, { message: "db error" }));

    await expect(getUsageByOwnerIds([1])).rejects.toThrow("db error");
  });
});

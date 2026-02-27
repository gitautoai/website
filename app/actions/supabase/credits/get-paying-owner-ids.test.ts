import { getPayingOwnerIds } from "./get-paying-owner-ids";

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

describe("getPayingOwnerIds", () => {
  it("returns deduplicated owner IDs that purchased credits", async () => {
    mockFrom.mockReturnValue(chainMock([{ owner_id: 1 }, { owner_id: 2 }, { owner_id: 1 }]));

    const result = await getPayingOwnerIds([1, 2, 3]);

    expect(result).toEqual([1, 2]);
    expect(mockFrom).toHaveBeenCalledWith("credits");
  });

  it("returns empty array for empty input", async () => {
    mockFrom.mockClear();
    const result = await getPayingOwnerIds([]);

    expect(result).toEqual([]);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("throws on error", async () => {
    mockFrom.mockReturnValue(chainMock(null, { message: "db error" }));

    await expect(getPayingOwnerIds([1])).rejects.toThrow("db error");
  });
});

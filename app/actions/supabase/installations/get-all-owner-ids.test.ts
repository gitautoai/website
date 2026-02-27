import { getAllOwnerIds } from "./get-all-owner-ids";

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

describe("getAllOwnerIds", () => {
  it("returns deduplicated owner IDs", async () => {
    const rows = [{ owner_id: 1 }, { owner_id: 2 }, { owner_id: 1 }, { owner_id: 3 }];
    mockFrom.mockReturnValue(chainMock(rows));

    const result = await getAllOwnerIds();

    expect(result).toEqual([1, 2, 3]);
    expect(mockFrom).toHaveBeenCalledWith("installations");
  });

  it("returns empty array when no installations", async () => {
    mockFrom.mockReturnValue(chainMock([]));

    const result = await getAllOwnerIds();

    expect(result).toEqual([]);
  });

  it("throws on error", async () => {
    mockFrom.mockReturnValue(chainMock(null, { message: "db error" }));

    await expect(getAllOwnerIds()).rejects.toThrow("db error");
  });
});

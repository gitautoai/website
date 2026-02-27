import { getUsersByIds } from "./get-users-by-ids";

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

describe("getUsersByIds", () => {
  it("returns users with emails that have not opted out", async () => {
    const rows = [
      {
        user_id: 1,
        email: "a@test.com",
        user_name: "alice",
        display_name: "Alice",
        display_name_override: null,
      },
    ];
    mockFrom.mockReturnValue(chainMock(rows));

    const result = await getUsersByIds([1, 2]);

    expect(result).toEqual(rows);
    expect(mockFrom).toHaveBeenCalledWith("users");
  });

  it("returns empty array for empty input", async () => {
    mockFrom.mockClear();
    const result = await getUsersByIds([]);

    expect(result).toEqual([]);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("throws on error", async () => {
    mockFrom.mockReturnValue(chainMock(null, { message: "db error" }));

    await expect(getUsersByIds([1])).rejects.toThrow("db error");
  });
});

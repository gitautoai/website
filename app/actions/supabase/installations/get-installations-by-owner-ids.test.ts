/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { getInstallationsByOwnerIds } from "./get-installations-by-owner-ids";

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

describe("getInstallationsByOwnerIds", () => {
  // ===== solitary =====

  it("returns empty array immediately if no ownerIds provided", async () => {
    const result = await getInstallationsByOwnerIds([]);
    expect(result).toEqual([]);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns installations for given owner IDs", async () => {
    const ownerIds = [1, 2];
    const mockInstallations = [
      { id: 101, owner_id: 1, name: "Inst 1" },
      { id: 102, owner_id: 2, name: "Inst 2" },
    ];
    mockFrom.mockReturnValue(chainMock(mockInstallations));

    const result = await getInstallationsByOwnerIds(ownerIds);

    expect(result).toEqual(mockInstallations);
    expect(mockFrom).toHaveBeenCalledWith("installations");

    const chain = mockFrom.mock.results[0].value;
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(chain.in).toHaveBeenCalledWith("owner_id", ownerIds);
    expect(chain.is).toHaveBeenCalledWith("uninstalled_at", null);
  });

  it("throws error when supabase returns an error", async () => {
    const ownerIds = [1];
    const dbError = { message: "Database connection failed" };
    mockFrom.mockReturnValue(chainMock(null, dbError));

    await expect(getInstallationsByOwnerIds(ownerIds)).rejects.toEqual(dbError);
  });
});

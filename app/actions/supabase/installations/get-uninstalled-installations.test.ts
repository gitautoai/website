import { getUninstalledInstallations } from "./get-uninstalled-installations";

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

describe("getUninstalledInstallations", () => {
  it("returns uninstalled installations ordered by uninstalled_at", async () => {
    const rows = [
      { owner_id: 1, owner_name: "org-a", uninstalled_at: "2025-01-01" },
      { owner_id: 2, owner_name: "org-b", uninstalled_at: "2025-02-01" },
    ];
    mockFrom.mockReturnValue(chainMock(rows));

    const result = await getUninstalledInstallations();

    expect(result).toEqual(rows);
    expect(mockFrom).toHaveBeenCalledWith("installations");
  });

  it("returns empty array when no uninstalled installations", async () => {
    mockFrom.mockReturnValue(chainMock([]));

    const result = await getUninstalledInstallations();

    expect(result).toEqual([]);
  });

  it("throws on error", async () => {
    mockFrom.mockReturnValue(chainMock(null, { message: "db error" }));

    await expect(getUninstalledInstallations()).rejects.toThrow("db error");
  });
});

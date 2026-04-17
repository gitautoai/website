import { getCreditTransactions } from "./get-credit-transactions";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: jest.fn() },
}));

const mockFrom = supabaseAdmin.from as jest.Mock;

const chainMock = (data: unknown, error: unknown = null) => {
  const chain: any = {};
  const methods = ["select", "not", "order", "in", "eq", "gt", "is", "limit"];
  methods.forEach((m) => {
    chain[m] = jest.fn().mockReturnValue(chain);
  });
  chain.then = jest.fn((resolve: any) => resolve({ data, error }));
  return chain;
};

describe("getCreditTransactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns transactions for a given owner", async () => {
    // Verify happy path where data is returned
    const mockData = [
      { owner_id: 1, amount_usd: 10, transaction_type: "purchase" },
      { owner_id: 1, amount_usd: -5, transaction_type: "usage" },
    ];
    const chain = chainMock(mockData);
    mockFrom.mockReturnValue(chain);

    const result = await getCreditTransactions(1);

    expect(result).toEqual(mockData);
    expect(mockFrom).toHaveBeenCalledWith("credits");
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(chain.eq).toHaveBeenCalledWith("owner_id", 1);
    expect(chain.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(chain.limit).toHaveBeenCalledWith(50); // Default limit
  });

  it("returns empty array when data is null", async () => {
    // Verify that null data from Supabase is converted to an empty array
    const chain = chainMock(null);
    mockFrom.mockReturnValue(chain);

    const result = await getCreditTransactions(1);

    expect(result).toEqual([]);
  });

  it("returns empty array when data is an empty array", async () => {
    // Verify that empty array from Supabase is returned as is
    const chain = chainMock([]);
    mockFrom.mockReturnValue(chain);

    const result = await getCreditTransactions(1);

    expect(result).toEqual([]);
  });

  it("throws an error when supabase returns an error", async () => {
    // Verify that Supabase errors are caught and re-thrown with a descriptive message
    const mockError = { message: "Database connection failed" };
    const chain = chainMock(null, mockError);
    mockFrom.mockReturnValue(chain);

    await expect(getCreditTransactions(1)).rejects.toThrow(
      "Failed to fetch credit transactions: Database connection failed",
    );
  });

  it("respects the custom limit parameter", async () => {
    // Verify that the limit parameter is correctly passed to the Supabase query
    const chain = chainMock([]);
    mockFrom.mockReturnValue(chain);

    await getCreditTransactions(1, 10);

    expect(chain.limit).toHaveBeenCalledWith(10);
  });

  it("handles null ownerId gracefully", async () => {
    // Verify that null ownerId (passed via any) doesn't crash and returns empty array
    const result = await getCreditTransactions(null as any);

    expect(result).toEqual([]);
  });

  it("handles undefined ownerId gracefully", async () => {
    // Verify that undefined ownerId (passed via any) doesn't crash and returns empty array or throws
    const chain = chainMock([]);
    mockFrom.mockReturnValue(chain);

    const result = await getCreditTransactions(undefined as any);

    expect(result).toEqual([]);
    expect(chain.eq).toHaveBeenCalledWith("owner_id", undefined);
  });
});

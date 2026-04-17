import { getCreditTransactions } from "./get-credit-transactions";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

const mockFrom = supabaseAdmin.from as jest.Mock;

describe("getCreditTransactions solitary", () => {
  const createMockChain = (data: any, error: any = null) => {
    return {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data, error }),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return transactions when supabase call is successful", async () => {
    // Verify happy path returns data correctly
    const mockData = [
      { id: 1, owner_id: 123, amount_usd: 10, transaction_type: "purchase" },
      { id: 2, owner_id: 123, amount_usd: -5, transaction_type: "usage" },
    ];
    const chain = createMockChain(mockData);
    mockFrom.mockReturnValue(chain);

    const result = await getCreditTransactions(123);

    expect(result).toEqual(mockData);
    expect(mockFrom).toHaveBeenCalledWith("credits");
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(chain.eq).toHaveBeenCalledWith("owner_id", 123);
    expect(chain.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(chain.limit).toHaveBeenCalledWith(50);
  });

  it("should return empty array when data is null", async () => {
    // Verify that null data from Supabase is normalized to an empty array
    const chain = createMockChain(null);
    mockFrom.mockReturnValue(chain);

    const result = await getCreditTransactions(123);

    expect(result).toEqual([]);
  });

  it("should throw error when supabase call fails", async () => {
    // Verify that Supabase errors are caught and re-thrown with a descriptive message
    const mockError = { message: "Database connection failed" };
    const chain = createMockChain(null, mockError);
    mockFrom.mockReturnValue(chain);

    await expect(getCreditTransactions(123)).rejects.toThrow("Failed to fetch credit transactions: Database connection failed");
  });

  it("should respect the custom limit parameter", async () => {
    // Verify that the limit parameter is correctly passed to the Supabase query
    const chain = createMockChain([]);
    mockFrom.mockReturnValue(chain);

    await getCreditTransactions(123, 10);

    expect(chain.limit).toHaveBeenCalledWith(10);
  });
});

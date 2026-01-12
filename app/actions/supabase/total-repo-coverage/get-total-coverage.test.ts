import { getTotalCoverage } from "./get-total-coverage";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("getTotalCoverage", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns total coverage data for an owner", async () => {
    const mockData = [
      {
        owner_id: 123,
        coverage_date: "2024-01-01",
        lines_covered: 800,
        lines_total: 1000,
        statement_coverage: 80,
      },
    ];

    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      }),
    });

    const result = await getTotalCoverage(123);

    expect(mockFrom).toHaveBeenCalledWith("total_repo_coverage");
    expect(result).toEqual(mockData);
  });

  it("returns empty array when no data", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    });

    const result = await getTotalCoverage(123);

    expect(result).toEqual([]);
  });

  it("throws error when query fails", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: { message: "DB error" } }),
        }),
      }),
    });

    await expect(getTotalCoverage(123)).rejects.toThrow("DB error");
  });
});

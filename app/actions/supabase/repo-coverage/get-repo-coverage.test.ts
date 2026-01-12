import { getRepoCoverage } from "./get-repo-coverage";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("getRepoCoverage", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns repo coverage data for owner and repo", async () => {
    const mockData = [
      {
        id: 1,
        owner_id: 123,
        repo_id: 456,
        statement_coverage: 80,
        lines_covered: 800,
        lines_total: 1000,
        created_at: "2024-01-01T00:00:00Z",
      },
    ];

    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      }),
    });

    const result = await getRepoCoverage(123, 456);

    expect(mockFrom).toHaveBeenCalledWith("repo_coverage");
    expect(result).toEqual(mockData);
  });

  it("returns empty array when no data", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    });

    const result = await getRepoCoverage(123, 456);

    expect(result).toEqual([]);
  });

  it("throws error when query fails", async () => {
    const mockError = { message: "DB error" };

    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      }),
    });

    await expect(getRepoCoverage(123, 456)).rejects.toEqual(mockError);
  });
});

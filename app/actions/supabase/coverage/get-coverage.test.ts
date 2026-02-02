import { getCoverage } from "./get-coverage";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("getCoverage", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("happy path", () => {
    it("should return coverage data when data exists", async () => {
      const mockData = [
        {
          id: 1,
          owner_id: 123,
          repo_id: 456,
          file_path: "src/index.ts",
          line_coverage: 85.5,
          statement_coverage: 90.0,
          function_coverage: 80.0,
          branch_coverage: 75.0,
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          owner_id: 123,
          repo_id: 456,
          file_path: "src/utils.ts",
          line_coverage: 95.0,
          statement_coverage: 92.0,
          function_coverage: 88.0,
          branch_coverage: 85.0,
          created_at: "2024-01-02T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getCoverage(123, 456);

      expect(mockFrom).toHaveBeenCalledWith("coverages");
      expect(result).toEqual(mockData);
    });

    it("should return single coverage entry", async () => {
      const mockData = [
        {
          id: 1,
          owner_id: 789,
          repo_id: 101,
          file_path: "app/main.ts",
          line_coverage: 100.0,
          statement_coverage: 100.0,
          function_coverage: 100.0,
          branch_coverage: 100.0,
          created_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getCoverage(789, 101);

      expect(result).toEqual(mockData);
      expect(result).toHaveLength(1);
    });
  });

  describe("edge cases", () => {
    it("should return empty array when data is null", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await getCoverage(123, 456);

      expect(mockFrom).toHaveBeenCalledWith("coverages");
      expect(result).toEqual([]);
    });

    it("should return empty array when no matching records", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await getCoverage(999, 888);

      expect(result).toEqual([]);
    });
  });

  describe("error cases", () => {
    it("should throw error when database query fails", async () => {
      const mockError = { message: "Database connection failed" };
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getCoverage(123, 456)).rejects.toEqual(mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching coverage data:", mockError);

      consoleErrorSpy.mockRestore();
    });

    it("should throw error with network timeout message", async () => {
      const mockError = { message: "Network timeout" };
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getCoverage(789, 101)).rejects.toEqual(mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching coverage data:", mockError);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("corner cases", () => {
    it("should handle very large owner and repo IDs", async () => {
      const largeOwnerId = 999999999999;
      const largeRepoId = 888888888888;

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await getCoverage(largeOwnerId, largeRepoId);

      expect(mockFrom).toHaveBeenCalledWith("coverages");
      expect(result).toEqual([]);
    });

    it("should verify correct query parameters are used", async () => {
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      const mockEq1 = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const mockEq2 = jest.fn().mockResolvedValue({ data: [], error: null });

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq1,
      });

      mockEq1.mockReturnValue({
        eq: mockEq2,
      });

      await getCoverage(555, 666);

      expect(mockFrom).toHaveBeenCalledWith("coverages");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq1).toHaveBeenCalledWith("owner_id", 555);
      expect(mockEq2).toHaveBeenCalledWith("repo_id", 666);
    });
  });
});

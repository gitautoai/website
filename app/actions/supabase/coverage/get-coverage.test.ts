 
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
          statement_coverage: 85.5,
          branch_coverage: 75.0,
          function_coverage: 90.0,
          line_coverage: 88.0,
          lines_covered: 88,
          lines_total: 100,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
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

    it("should return multiple coverage records", async () => {
      const mockData = [
        {
          id: 1,
          owner_id: 123,
          repo_id: 456,
          file_path: "src/index.ts",
          statement_coverage: 85.5,
          branch_coverage: 75.0,
          function_coverage: 90.0,
          line_coverage: 88.0,
          lines_covered: 88,
          lines_total: 100,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          owner_id: 123,
          repo_id: 456,
          file_path: "src/utils.ts",
          statement_coverage: 95.0,
          branch_coverage: 85.0,
          function_coverage: 100.0,
          line_coverage: 92.0,
          lines_covered: 92,
          lines_total: 100,
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
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

      expect(result).toEqual(mockData);
      expect(result).toHaveLength(2);
    });

    it("should return coverage data with zero coverage", async () => {
      const mockData = [
        {
          id: 3,
          owner_id: 789,
          repo_id: 101,
          file_path: "src/uncovered.ts",
          statement_coverage: 0,
          branch_coverage: 0,
          function_coverage: 0,
          line_coverage: 0,
          lines_covered: 0,
          lines_total: 50,
          created_at: "2024-01-03T00:00:00Z",
          updated_at: "2024-01-03T00:00:00Z",
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
      expect(result[0].statement_coverage).toBe(0);
    });

    it("should return coverage data with 100% coverage", async () => {
      const mockData = [
        {
          id: 4,
          owner_id: 111,
          repo_id: 222,
          file_path: "src/perfect.ts",
          statement_coverage: 100,
          branch_coverage: 100,
          function_coverage: 100,
          line_coverage: 100,
          lines_covered: 100,
          lines_total: 100,
          created_at: "2024-01-04T00:00:00Z",
          updated_at: "2024-01-04T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getCoverage(111, 222);

      expect(result).toEqual(mockData);
      expect(result[0].statement_coverage).toBe(100);
    });
  });

  describe("edge cases", () => {
    it("should return empty array when no coverage data exists", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await getCoverage(999, 888);

      expect(mockFrom).toHaveBeenCalledWith("coverages");
      expect(result).toEqual([]);
    });

    it("should return empty array when data is null", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await getCoverage(123, 456);

      expect(result).toEqual([]);
    });

    it("should handle negative owner IDs", async () => {
      const mockData = [
        {
          id: 5,
          owner_id: -1,
          repo_id: 456,
          file_path: "src/test.ts",
          statement_coverage: 50,
          branch_coverage: 50,
          function_coverage: 50,
          line_coverage: 50,
          lines_covered: 50,
          lines_total: 100,
          created_at: "2024-01-05T00:00:00Z",
          updated_at: "2024-01-05T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getCoverage(-1, 456);

      expect(result).toEqual(mockData);
    });

    it("should handle negative repo IDs", async () => {
      const mockData = [
        {
          id: 6,
          owner_id: 123,
          repo_id: -1,
          file_path: "src/test.ts",
          statement_coverage: 50,
          branch_coverage: 50,
          function_coverage: 50,
          line_coverage: 50,
          lines_covered: 50,
          lines_total: 100,
          created_at: "2024-01-06T00:00:00Z",
          updated_at: "2024-01-06T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getCoverage(123, -1);

      expect(result).toEqual(mockData);
    });

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
      expect(mockFrom).toHaveBeenCalledWith("coverages");

      consoleErrorSpy.mockRestore();
    });

    it("should throw error with network error message", async () => {
      const mockError = { message: "Network timeout" };
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getCoverage(456, 789)).rejects.toEqual(mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching coverage data:", mockError);

      consoleErrorSpy.mockRestore();
    });

    it("should throw error with permission denied message", async () => {
      const mockError = { message: "Permission denied" };
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

    it("should throw error with table not found message", async () => {
      const mockError = { message: 'relation "coverages" does not exist' };
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getCoverage(999, 888)).rejects.toEqual(mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching coverage data:", mockError);

      consoleErrorSpy.mockRestore();
    });

    it("should throw error with constraint violation message", async () => {
      const mockError = { message: "Foreign key constraint violation" };
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getCoverage(111, 222)).rejects.toEqual(mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching coverage data:", mockError);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("corner cases", () => {
    it("should handle coverage data with decimal values", async () => {
      const mockData = [
        {
          id: 7,
          owner_id: 333,
          repo_id: 444,
          file_path: "src/decimal.ts",
          statement_coverage: 85.5555,
          branch_coverage: 75.1234,
          function_coverage: 90.9999,
          line_coverage: 88.8888,
          lines_covered: 88,
          lines_total: 100,
          created_at: "2024-01-07T00:00:00Z",
          updated_at: "2024-01-07T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getCoverage(333, 444);

      expect(result).toEqual(mockData);
      expect(result[0].statement_coverage).toBe(85.5555);
    });

    it("should handle coverage data with very long file paths", async () => {
      const longPath = "src/" + "a/".repeat(100) + "file.ts";
      const mockData = [
        {
          id: 8,
          owner_id: 555,
          repo_id: 666,
          full_path: longPath,
          statement_coverage: 50,
          branch_coverage: 50,
          function_coverage: 50,
          line_coverage: 50,
          created_at: "2024-01-08T00:00:00Z",
          updated_at: "2024-01-08T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getCoverage(555, 666);

      expect(result).toEqual(mockData);
      expect(result[0].full_path).toBe(longPath);
    });

    it("should handle coverage data with special characters in file path", async () => {
      const mockData = [
        {
          id: 10,
          owner_id: 999,
          repo_id: 1111,
          full_path: "src/special-chars_@#$%.ts",
          statement_coverage: 75,
          branch_coverage: 75,
          function_coverage: 75,
          line_coverage: 75,
          created_at: "2024-01-10T00:00:00Z",
          updated_at: "2024-01-10T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getCoverage(999, 1111);

      expect(result).toEqual(mockData);
      expect(result[0].full_path).toBe("src/special-chars_@#$%.ts");
    });

    it("should handle zero as owner and repo IDs", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await getCoverage(0, 0);

      expect(result).toEqual([]);
    });
  });
});

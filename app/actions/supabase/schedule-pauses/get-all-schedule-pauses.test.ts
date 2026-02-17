import { getAllSchedulePauses } from "./get-all-schedule-pauses";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("getAllSchedulePauses", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("happy path", () => {
    it("should return pauses for a given owner", async () => {
      const mockPauses = [
        {
          id: "uuid-1",
          owner_id: 123,
          repo_id: 456,
          pause_start: "2026-03-01",
          pause_end: "2026-03-10",
          reason: "Holiday",
          created_by: "1:user",
          created_at: "2026-02-12T00:00:00Z",
          updated_by: "1:user",
          updated_at: "2026-02-12T00:00:00Z",
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: mockPauses, error: null });
      const mockGte = jest.fn().mockReturnValue({ order: mockOrder });
      const mockEq = jest.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      const result = await getAllSchedulePauses(123);

      expect(mockFrom).toHaveBeenCalledWith("schedule_pauses");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(result).toEqual(mockPauses);
    });

    it("should return empty array when no pauses exist", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
      const mockGte = jest.fn().mockReturnValue({ order: mockOrder });
      const mockEq = jest.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      const result = await getAllSchedulePauses(123);

      expect(result).toEqual([]);
    });

    it("should return empty array when data is null", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockGte = jest.fn().mockReturnValue({ order: mockOrder });
      const mockEq = jest.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      const result = await getAllSchedulePauses(123);

      expect(result).toEqual([]);
    });
  });

  describe("validation", () => {
    it("should throw when ownerId is 0", async () => {
      await expect(getAllSchedulePauses(0)).rejects.toThrow("Missing required parameter: ownerId");
    });
  });

  describe("error cases", () => {
    it("should throw when database query fails", async () => {
      const mockError = { message: "Database error" };
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockGte = jest.fn().mockReturnValue({ order: mockOrder });
      const mockEq = jest.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      await expect(getAllSchedulePauses(123)).rejects.toEqual(mockError);
    });
  });
});

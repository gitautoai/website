import { addSchedulePause } from "./add-schedule-pause";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("addSchedulePause", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("happy path", () => {
    it("should insert a pause and return the created record", async () => {
      const mockPause = {
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
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: mockPause, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      mockFrom.mockReturnValue({ insert: mockInsert });

      const result = await addSchedulePause(
        123,
        456,
        "2026-03-01",
        "2026-03-10",
        "1:user",
        "Holiday",
      );

      expect(mockFrom).toHaveBeenCalledWith("schedule_pauses");
      expect(mockInsert).toHaveBeenCalledWith({
        owner_id: 123,
        repo_id: 456,
        pause_start: "2026-03-01",
        pause_end: "2026-03-10",
        reason: "Holiday",
        created_by: "1:user",
        updated_by: "1:user",
      });
      expect(result).toEqual(mockPause);
    });

    it("should set reason to null when not provided", async () => {
      const mockPause = {
        id: "uuid-2",
        owner_id: 123,
        repo_id: 456,
        pause_start: "2026-03-01",
        pause_end: "2026-03-10",
        reason: null,
        created_by: "1:user",
        created_at: "2026-02-12T00:00:00Z",
        updated_by: "1:user",
        updated_at: "2026-02-12T00:00:00Z",
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: mockPause, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      mockFrom.mockReturnValue({ insert: mockInsert });

      await addSchedulePause(123, 456, "2026-03-01", "2026-03-10", "1:user");

      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ reason: null }));
    });
  });

  describe("validation", () => {
    it("should throw when ownerId is 0", async () => {
      await expect(addSchedulePause(0, 456, "2026-03-01", "2026-03-10", "1:user")).rejects.toThrow(
        "Missing required parameters",
      );
    });

    it("should throw when repoId is 0", async () => {
      await expect(addSchedulePause(123, 0, "2026-03-01", "2026-03-10", "1:user")).rejects.toThrow(
        "Missing required parameters",
      );
    });

    it("should throw when pauseStart is empty", async () => {
      await expect(addSchedulePause(123, 456, "", "2026-03-10", "1:user")).rejects.toThrow(
        "Missing date range",
      );
    });

    it("should throw when pauseEnd is empty", async () => {
      await expect(addSchedulePause(123, 456, "2026-03-01", "", "1:user")).rejects.toThrow(
        "Missing date range",
      );
    });

    it("should throw when end date is before start date", async () => {
      await expect(
        addSchedulePause(123, 456, "2026-03-10", "2026-03-01", "1:user"),
      ).rejects.toThrow("End date must be on or after start date");
    });

    it("should not throw when start and end dates are the same", async () => {
      const mockPause = {
        id: "uuid-3",
        owner_id: 123,
        repo_id: 456,
        pause_start: "2026-03-01",
        pause_end: "2026-03-01",
        reason: null,
        created_by: "1:user",
        created_at: "2026-02-12T00:00:00Z",
        updated_by: "1:user",
        updated_at: "2026-02-12T00:00:00Z",
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: mockPause, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      mockFrom.mockReturnValue({ insert: mockInsert });

      const result = await addSchedulePause(123, 456, "2026-03-01", "2026-03-01", "1:user");

      expect(result).toEqual(mockPause);
    });
  });

  describe("error cases", () => {
    it("should throw when database insert fails", async () => {
      const mockError = { message: "Insert failed" };
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      mockFrom.mockReturnValue({ insert: mockInsert });

      await expect(
        addSchedulePause(123, 456, "2026-03-01", "2026-03-10", "1:user"),
      ).rejects.toEqual(mockError);
    });
  });
});

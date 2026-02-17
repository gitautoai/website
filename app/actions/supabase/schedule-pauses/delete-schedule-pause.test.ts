import { deleteSchedulePause } from "./delete-schedule-pause";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("deleteSchedulePause", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("happy path", () => {
    it("should delete a pause by id", async () => {
      const mockEq = jest.fn().mockResolvedValue({ error: null });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ delete: mockDelete });

      await deleteSchedulePause("uuid-1");

      expect(mockFrom).toHaveBeenCalledWith("schedule_pauses");
      expect(mockEq).toHaveBeenCalledWith("id", "uuid-1");
    });
  });

  describe("validation", () => {
    it("should throw when pauseId is empty", async () => {
      await expect(deleteSchedulePause("")).rejects.toThrow("Missing required parameter: pauseId");
    });
  });

  describe("error cases", () => {
    it("should throw when database delete fails", async () => {
      const mockError = { message: "Delete failed" };
      const mockEq = jest.fn().mockResolvedValue({ error: mockError });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ delete: mockDelete });

      await expect(deleteSchedulePause("uuid-1")).rejects.toEqual(mockError);
    });
  });
});

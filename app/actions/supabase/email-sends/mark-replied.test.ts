import { markReplied } from "./mark-replied";

// Mock supabaseAdmin
const mockUpdate = jest.fn().mockReturnThis();
const mockIn = jest.fn().mockReturnThis();
const mockIs = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      update: mockUpdate,
    })),
  },
}));

import { supabaseAdmin } from "@/lib/supabase/server";

beforeEach(() => {
  jest.clearAllMocks();
  mockUpdate.mockReturnValue({ in: mockIn });
  mockIn.mockReturnValue({ is: mockIs });
});

it("does nothing when entries is empty", async () => {
  await markReplied([]);
  expect(supabaseAdmin.from).not.toHaveBeenCalled();
});

it("updates replied_at with the actual reply timestamp", async () => {
  mockIs.mockResolvedValue({ error: null });
  const repliedAt = "2026-02-27T10:00:00.000Z";
  await markReplied([
    { ownerId: 1, repliedAt },
    { ownerId: 2, repliedAt },
  ]);

  expect(supabaseAdmin.from).toHaveBeenCalledWith("email_sends");
  expect(mockUpdate).toHaveBeenCalledWith({
    replied_at: repliedAt,
    updated_at: expect.any(String),
  });
  expect(mockIn).toHaveBeenCalledWith("owner_id", [1, 2]);
  expect(mockIs).toHaveBeenCalledWith("replied_at", null);
});

it("groups updates by timestamp", async () => {
  mockIs.mockResolvedValue({ error: null });
  await markReplied([
    { ownerId: 1, repliedAt: "2026-02-27T10:00:00.000Z" },
    { ownerId: 2, repliedAt: "2026-02-28T12:00:00.000Z" },
  ]);

  expect(supabaseAdmin.from).toHaveBeenCalledTimes(2);
  expect(mockUpdate).toHaveBeenCalledWith({
    replied_at: "2026-02-27T10:00:00.000Z",
    updated_at: expect.any(String),
  });
  expect(mockUpdate).toHaveBeenCalledWith({
    replied_at: "2026-02-28T12:00:00.000Z",
    updated_at: expect.any(String),
  });
});

it("logs error when update fails", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation();
  mockIs.mockResolvedValue({ error: { message: "DB error" } });

  await markReplied([{ ownerId: 1, repliedAt: "2026-02-27T10:00:00.000Z" }]);
  expect(consoleSpy).toHaveBeenCalledWith("[drip] Failed to mark replies:", "DB error");
  consoleSpy.mockRestore();
});

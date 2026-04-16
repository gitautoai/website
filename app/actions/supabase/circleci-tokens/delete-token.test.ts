/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { deleteCircleCIToken } from "./delete-token";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("deleteCircleCIToken", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;
  const mockEq = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the chained mock: from().delete().eq()
    mockEq.mockResolvedValue({ error: null });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ delete: mockDelete });
  });

  // Verifies that a valid ownerId triggers the correct Supabase delete call
  // with the right table and filter parameters
  it("calls supabase delete with correct table and owner_id", async () => {
    await deleteCircleCIToken(42);

    expect(mockFrom).toHaveBeenCalledWith("circleci_tokens");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("owner_id", 42);
  });

  // Verifies the early return when ownerId is 0 (falsy) — covers branch at line 6
  it("returns early without calling supabase when ownerId is 0", async () => {
    const result = await deleteCircleCIToken(0);

    expect(result).toBeUndefined();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // Verifies the early return when ownerId is NaN (falsy) — another falsy number edge case
  it("returns early without calling supabase when ownerId is NaN", async () => {
    const result = await deleteCircleCIToken(NaN);

    expect(result).toBeUndefined();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // Verifies that a Supabase error is thrown to the caller — covers branch at line 10
  it("throws the supabase error when delete fails", async () => {
    const dbError = { message: "row not found", code: "PGRST116" };
    mockEq.mockResolvedValue({ error: dbError });

    await expect(deleteCircleCIToken(99)).rejects.toEqual(dbError);
  });

  // Verifies successful deletion returns undefined (no explicit return value)
  it("returns undefined on successful deletion", async () => {
    const result = await deleteCircleCIToken(123);

    expect(result).toBeUndefined();
  });

  // Verifies that a large ownerId is passed through correctly without truncation
  it("handles large owner IDs correctly", async () => {
    await deleteCircleCIToken(999999999);

    expect(mockEq).toHaveBeenCalledWith("owner_id", 999999999);
  });

  // Verifies that negative ownerId (truthy) still triggers the delete call
  it("does not early-return for negative ownerId since it is truthy", async () => {
    await deleteCircleCIToken(-1);

    expect(mockFrom).toHaveBeenCalledWith("circleci_tokens");
    expect(mockEq).toHaveBeenCalledWith("owner_id", -1);
  });
});


import { getCircleCIToken } from "./get-token";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("getCircleCIToken", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the chained mock: from().select().eq().single()
    mockSingle.mockResolvedValue({ data: null, error: null });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });
  });

  // Verifies that a valid ownerId triggers the correct Supabase query
  // with the right table, selection, and filter parameters
  it("calls supabase select with correct table and owner_id", async () => {
    const mockToken = { id: 1, token: "test-token", owner_id: 42 };
    mockSingle.mockResolvedValue({ data: mockToken, error: null });

    const result = await getCircleCIToken(42);

    expect(mockFrom).toHaveBeenCalledWith("circleci_tokens");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("owner_id", 42);
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(mockToken);
  });

  // Verifies the early return when ownerId is 0 (falsy) — covers branch at line 6
  it("returns null without calling supabase when ownerId is 0", async () => {
    const result = await getCircleCIToken(0);

    expect(result).toBeNull();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // Verifies the early return when ownerId is NaN (falsy) — another falsy number edge case
  it("returns null without calling supabase when ownerId is NaN", async () => {
    const result = await getCircleCIToken(NaN);

    expect(result).toBeNull();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // Verifies that when no token is found, it returns null (as data is null from .single())
  it("returns null when no token is found in the database", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: "JSON object requested, but 0 rows returned" } });

    const result = await getCircleCIToken(99);

    expect(result).toBeNull();
    expect(mockSingle).toHaveBeenCalled();
  });

  // Verifies that a large ownerId is passed through correctly without truncation
  it("handles large owner IDs correctly", async () => {
    const largeId = 999999999;
    await getCircleCIToken(largeId);

    expect(mockEq).toHaveBeenCalledWith("owner_id", largeId);
  });

  // Verifies that negative ownerId (truthy) still triggers the query
  it("does not early-return for negative ownerId since it is truthy", async () => {
    await getCircleCIToken(-1);

    expect(mockFrom).toHaveBeenCalledWith("circleci_tokens");
    expect(mockEq).toHaveBeenCalledWith("owner_id", -1);
  });
});

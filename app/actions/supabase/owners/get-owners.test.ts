/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOwners } from "./get-owners";

// Mock the supabase server module before importing
jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

import { supabaseAdmin } from "@/lib/supabase/server";

describe("getOwners", () => {
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect = jest.fn();
    mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });
    (supabaseAdmin.from as jest.Mock) = mockFrom;
  });

  it("should return owners when query is successful", async () => {
    const mockOwners = [
      {
        id: "owner-1",
        login: "testuser1",
        type: "User",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "owner-2",
        login: "testuser2",
        type: "Organization",
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      },
    ];

    mockSelect.mockResolvedValue({
      data: mockOwners,
      error: null,
    });

    const result = await getOwners(supabaseAdmin);

    expect(mockFrom).toHaveBeenCalledWith("owners");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(result).toEqual(mockOwners);
  });

  it("should return empty array when no owners exist", async () => {
    mockSelect.mockResolvedValue({
      data: [],
      error: null,
    });

    const result = await getOwners(supabaseAdmin);

    expect(mockFrom).toHaveBeenCalledWith("owners");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(result).toEqual([]);
  });

  it("should throw error when query fails", async () => {
    const mockError = {
      message: "Database connection failed",
      code: "PGRST301",
    };

    mockSelect.mockResolvedValue({
      data: null,
      error: mockError,
    });

    await expect(getOwners(supabaseAdmin)).rejects.toThrow(
      "Database connection failed"
    );
    expect(mockFrom).toHaveBeenCalledWith("owners");
    expect(mockSelect).toHaveBeenCalledWith("*");
  });

  it("should throw error when data is null", async () => {
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: "No data returned" },
    });

    await expect(getOwners(supabaseAdmin)).rejects.toThrow("No data returned");
  });
});

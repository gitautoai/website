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
  let mockIn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIn = jest.fn();
    mockSelect = jest.fn().mockReturnValue({
      in: mockIn,
    });
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

    mockIn.mockResolvedValue({
      data: mockOwners,
      error: null,
    });

    const result = await getOwners([1, 2]);

    expect(mockFrom).toHaveBeenCalledWith("owners");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockIn).toHaveBeenCalledWith("owner_id", [1, 2]);
    expect(result).toEqual(mockOwners);
  });

  it("should return empty array when no owners exist", async () => {
    mockIn.mockResolvedValue({
      data: [],
      error: null,
    });

    const result = await getOwners([999]);

    expect(mockFrom).toHaveBeenCalledWith("owners");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockIn).toHaveBeenCalledWith("owner_id", [999]);
    expect(result).toEqual([]);
  });

  it("should throw error when query fails", async () => {
    const mockError = {
      message: "Database connection failed",
      code: "PGRST301",
    };

    mockIn.mockResolvedValue({
      data: null,
      error: mockError,
    });

    await expect(getOwners([1, 2])).rejects.toThrow(
      "Database connection failed"
    );
    expect(mockFrom).toHaveBeenCalledWith("owners");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockIn).toHaveBeenCalledWith("owner_id", [1, 2]);
  });

  it("should return empty array when data is null but no error", async () => {
    mockIn.mockResolvedValue({
      data: null,
      error: null,
    });

    const result = await getOwners([1]);

    expect(result).toEqual([]);
  });

  it("should handle empty ids array by returning empty array immediately", async () => {
    const result = await getOwners([]);

    // Should not call database when ids is empty
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockSelect).not.toHaveBeenCalled();
    expect(mockIn).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});

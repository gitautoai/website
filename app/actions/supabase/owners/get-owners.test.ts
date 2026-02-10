/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOwners } from "./get-owners";
import { createClient } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server");

describe("getOwners", () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
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

    mockSupabase.select.mockResolvedValue({
      data: mockOwners,
      error: null,
    });

    const result = await getOwners();

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSupabase.from).toHaveBeenCalledWith("owners");
    expect(mockSupabase.select).toHaveBeenCalledWith("*");
    expect(result).toEqual(mockOwners);
  });

  it("should return empty array when no owners exist", async () => {
    mockSupabase.select.mockResolvedValue({
      data: [],
      error: null,
    });

    const result = await getOwners();

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSupabase.from).toHaveBeenCalledWith("owners");
    expect(mockSupabase.select).toHaveBeenCalledWith("*");
    expect(result).toEqual([]);
  });

  it("should throw error when query fails", async () => {
    const mockError = {
      message: "Database connection failed",
      code: "PGRST301",
    };

    mockSupabase.select.mockResolvedValue({
      data: null,
      error: mockError,
    });

    await expect(getOwners()).rejects.toThrow("Database connection failed");
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSupabase.from).toHaveBeenCalledWith("owners");
    expect(mockSupabase.select).toHaveBeenCalledWith("*");
  });

  it("should throw error when data is null", async () => {
    mockSupabase.select.mockResolvedValue({
      data: null,
      error: { message: "No data returned" },
    });

    await expect(getOwners()).rejects.toThrow("No data returned");
  });
});

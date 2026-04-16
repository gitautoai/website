import { getUser } from "./get-user";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: jest.fn() },
}));

const mockFrom = supabaseAdmin.from as jest.Mock;

const chainMock = (data: unknown, error: unknown = null) => {
  const chain: any = {};
  const methods = ["select", "not", "order", "in", "eq", "gt", "is", "limit", "maybeSingle"];
  for (const m of methods) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

describe("getUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the user when found", async () => {
    // Verify that when a user exists, the function returns the user data
    const mockUser = {
      user_id: 123,
      email: "test@example.com",
      user_name: "testuser",
    };
    mockFrom.mockReturnValue(chainMock(mockUser));

    const result = await getUser(123);

    expect(result).toEqual(mockUser);
    expect(mockFrom).toHaveBeenCalledWith("users");
    const chain = mockFrom.mock.results[0].value;
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(chain.eq).toHaveBeenCalledWith("user_id", 123);
    expect(chain.maybeSingle).toHaveBeenCalled();
  });

  it("returns null when user is not found", async () => {
    // Verify that when no user is found (maybeSingle returns null data), the function returns null
    mockFrom.mockReturnValue(chainMock(null));

    const result = await getUser(456);

    expect(result).toBeNull();
    expect(mockFrom).toHaveBeenCalledWith("users");
  });

  it("returns null and logs error when Supabase returns an error", async () => {
    // Verify that when Supabase returns an error, it is logged and the function returns null
    const mockError = { message: "Database connection failed" };
    mockFrom.mockReturnValue(chainMock(null, mockError));

    const result = await getUser(789);

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith("Get user error:", mockError);
  });

  it("handles non-numeric userId gracefully (adversarial)", async () => {
    // Verify behavior when userId is not a number (e.g. passed from JS)
    const result = await getUser("not-a-number" as any);

    expect(mockFrom).toHaveBeenCalledWith("users");
    // The function should still attempt the query and return whatever Supabase returns (likely null or error)
    // In our mock, it will return null because we didn't set a return value for this specific call,
    // but let's be explicit.
    mockFrom.mockReturnValue(chainMock(null));
    const result2 = await getUser("not-a-number" as any);
    expect(result2).toBeNull();
  });
});

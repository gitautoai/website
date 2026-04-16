/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { getNpmToken } from "./get-token";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: jest.fn() },
}));

const mockFrom = supabaseAdmin.from as jest.Mock;

const chainMock = (data: any, error: any = null) => {
  const chain: any = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.single = jest.fn().mockResolvedValue({ data, error });
  return chain;
};

describe("getNpmToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null if ownerId is missing or falsy", async () => {
    // Verify that if ownerId is 0, null, or undefined, it returns null without calling DB
    expect(await getNpmToken(0)).toBeNull();
    expect(await getNpmToken(null as any)).toBeNull();
    expect(await getNpmToken(undefined as any)).toBeNull();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns the token when it exists for the given ownerId", async () => {
    // Verify successful retrieval of a token for a valid ownerId
    const mockToken = { id: 1, owner_id: 123, token: "secret-token" };
    const chain = chainMock(mockToken);
    mockFrom.mockReturnValue(chain);

    const result = await getNpmToken(123);

    expect(result).toEqual(mockToken);
    expect(mockFrom).toHaveBeenCalledWith("npm_tokens");
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(chain.eq).toHaveBeenCalledWith("owner_id", 123);
    expect(chain.single).toHaveBeenCalled();
  });

  it("returns null when no token is found for the given ownerId", async () => {
    // Verify that it returns null when Supabase returns no data (e.g. single() not finding a row)
    const chain = chainMock(null, { message: "JSON object requested, but 0 rows returned" });
    mockFrom.mockReturnValue(chain);

    const result = await getNpmToken(123);

    expect(result).toBeNull();
    expect(mockFrom).toHaveBeenCalledWith("npm_tokens");
    expect(chain.single).toHaveBeenCalled();
  });

  it("returns null when a database error occurs", async () => {
    // Verify that it gracefully returns null (via data being null) when a DB error occurs
    const chain = chainMock(null, { message: "Database connection error" });
    mockFrom.mockReturnValue(chain);

    const result = await getNpmToken(123);

    expect(result).toBeNull();
    expect(mockFrom).toHaveBeenCalledWith("npm_tokens");
    expect(chain.single).toHaveBeenCalled();
  });
});

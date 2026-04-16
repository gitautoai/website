/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */

import { deleteNpmToken } from "./delete-token";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: jest.fn() },
}));

const mockFrom = supabaseAdmin.from as jest.Mock;

const chainMock = (error: any = null) => {
  const chain: any = {};
  chain.delete = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockResolvedValue({ error });
  return chain;
};

describe("deleteNpmToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws an error if ownerId is missing or falsy", async () => {
    // Verify that if ownerId is 0, null, or undefined, it throws "Owner ID is required"
    await expect(deleteNpmToken(0)).rejects.toThrow("Owner ID is required");
    await expect(deleteNpmToken(null as any)).rejects.toThrow("Owner ID is required");
    await expect(deleteNpmToken(undefined as any)).rejects.toThrow("Owner ID is required");
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("successfully deletes the token for the given ownerId", async () => {
    // Verify successful deletion when Supabase returns no error
    const chain = chainMock(null);
    mockFrom.mockReturnValue(chain);

    await expect(deleteNpmToken(123)).resolves.not.toThrow();
    expect(mockFrom).toHaveBeenCalledWith("npm_tokens");
    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith("owner_id", 123);
  });

  it("throws an error when Supabase returns an error", async () => {
    // Verify that it throws the error returned by Supabase
    const mockError = new Error("Database error during deletion");
    const chain = chainMock(mockError);
    mockFrom.mockReturnValue(chain);

    await expect(deleteNpmToken(123)).rejects.toThrow(mockError);
    expect(mockFrom).toHaveBeenCalledWith("npm_tokens");
    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith("owner_id", 123);
  });
});

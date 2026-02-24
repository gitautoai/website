import { getSentEmails } from "./get-sent-emails";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: jest.fn() },
}));

import { supabaseAdmin } from "@/lib/supabase/server";

const mockFrom = supabaseAdmin.from as jest.Mock;

const createChainMock = (data: unknown, error: unknown = null) => {
  const chain: Record<string, jest.Mock> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.in = jest.fn().mockReturnValue(chain);
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

describe("getSentEmails", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return empty object for empty ownerIds", async () => {
    const result = await getSentEmails([]);

    expect(result).toEqual({});
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("should return grouped sets by owner_id", async () => {
    mockFrom.mockReturnValue(
      createChainMock([
        { owner_id: 1, email_type: "onboarding_review_setup_pr" },
        { owner_id: 1, email_type: "milestone_10_prs" },
        { owner_id: 2, email_type: "onboarding_coverage_charts" },
      ]),
    );

    const result = await getSentEmails([1, 2]);

    expect(result[1]).toEqual(new Set(["onboarding_review_setup_pr", "milestone_10_prs"]));
    expect(result[2]).toEqual(new Set(["onboarding_coverage_charts"]));
  });

  it("should return empty object when no rows found", async () => {
    mockFrom.mockReturnValue(createChainMock([]));

    const result = await getSentEmails([1]);

    expect(result).toEqual({});
  });

  it("should throw on database error", async () => {
    mockFrom.mockReturnValue(createChainMock(null, { message: "connection refused" }));

    await expect(getSentEmails([1])).rejects.toThrow(
      "Failed to fetch sent emails: connection refused",
    );
  });
});

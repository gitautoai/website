import { insertEmailSend } from "./insert-email-send";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: jest.fn() },
}));

import { supabaseAdmin } from "@/lib/supabase/server";

const mockFrom = supabaseAdmin.from as jest.Mock;

const mockInsert = (error: unknown = null) => {
  const insert = jest.fn().mockResolvedValue({ error });
  mockFrom.mockReturnValue({ insert });
  return insert;
};

describe("insertEmailSend", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should insert and return true on success", async () => {
    const insert = mockInsert();

    const result = await insertEmailSend({
      ownerId: 1,
      ownerName: "test-org",
      emailType: "onboarding_review_setup_pr",
      resendEmailId: "re_123",
    });

    expect(result).toBe(true);
    expect(insert).toHaveBeenCalledWith({
      owner_id: 1,
      owner_name: "test-org",
      email_type: "onboarding_review_setup_pr",
      resend_email_id: "re_123",
    });
  });

  it("should set resend_email_id to null when not provided", async () => {
    const insert = mockInsert();

    await insertEmailSend({
      ownerId: 1,
      ownerName: "test-org",
      emailType: "onboarding_coverage_charts",
    });

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ resend_email_id: null }));
  });

  it("should return false on unique violation (23505)", async () => {
    mockInsert({ code: "23505", message: "duplicate key" });

    const result = await insertEmailSend({
      ownerId: 1,
      ownerName: "test-org",
      emailType: "onboarding_review_setup_pr",
    });

    expect(result).toBe(false);
  });

  it("should throw on other database errors", async () => {
    mockInsert({ code: "42P01", message: "relation does not exist" });

    await expect(
      insertEmailSend({
        ownerId: 1,
        ownerName: "test-org",
        emailType: "onboarding_review_setup_pr",
      }),
    ).rejects.toThrow("Failed to insert email send: relation does not exist");
  });
});

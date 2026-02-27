import { processDripEmails } from ".";

// Mock dependencies
jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: { from: jest.fn() },
}));

jest.mock("@/app/actions/resend/send-email", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("@/app/actions/supabase/email-sends/get-sent-emails", () => ({
  getSentEmails: jest.fn(),
}));

jest.mock("@/app/actions/supabase/email-sends/insert-email-send", () => ({
  insertEmailSend: jest.fn(),
}));

jest.mock("@/utils/generate-random-delay", () => ({
  generateRandomDelay: jest.fn(() => new Date("2026-01-01T01:00:00Z")),
}));

jest.mock("@/app/actions/stripe/get-active-subscription-customer-ids", () => ({
  getActiveSubscriptionCustomerIds: jest.fn(() => Promise.resolve(new Set<string>())),
}));

jest.mock("@/app/actions/stripe/get-canceled-subscription-customer-ids", () => ({
  getCanceledSubscriptionCustomerIds: jest.fn(() => Promise.resolve(new Map<string, string>())),
}));

jest.mock("@/app/actions/stripe/get-owner-ids-had-subscription", () => ({
  getOwnerIdsHadSubscription: jest.fn(() => Promise.resolve(new Map<number, string>())),
}));

jest.mock("./process-salvage", () => ({
  processSalvage: jest.fn(() => Promise.resolve([])),
}));

jest.mock("@/app/actions/github/is-pr-open", () => ({
  isPrOpen: jest.fn(() => Promise.resolve(true)),
}));

import { supabaseAdmin } from "@/lib/supabase/server";
import { sendEmail } from "@/app/actions/resend/send-email";
import { getSentEmails } from "@/app/actions/supabase/email-sends/get-sent-emails";
import { getActiveSubscriptionCustomerIds } from "@/app/actions/stripe/get-active-subscription-customer-ids";
import { insertEmailSend } from "@/app/actions/supabase/email-sends/insert-email-send";

const mockFrom = supabaseAdmin.from as jest.Mock;
const mockSendEmail = sendEmail as jest.Mock;
const mockGetSentEmails = getSentEmails as jest.Mock;
const mockGetActiveSubCustomerIds = getActiveSubscriptionCustomerIds as jest.Mock;
const mockInsertEmailSend = insertEmailSend as jest.Mock;

// Helper to create a chained mock for supabase queries
const createChainMock = (data: unknown, error: unknown = null) => {
  const terminal = jest.fn().mockResolvedValue({ data, error });
  const chain: Record<string, jest.Mock> = {};

  const methods = ["select", "eq", "neq", "is", "not", "gt", "in", "order", "limit", "range"];
  for (const method of methods) {
    chain[method] = jest.fn().mockReturnValue(chain);
  }

  // Make the chain thenable so await resolves it
  chain.then = jest.fn((resolve) => resolve({ data, error }));

  // Terminal methods
  chain.maybeSingle = terminal;
  chain.single = terminal;

  return chain;
};

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const mockTables = (overrides: Record<string, unknown[]> = {}) => {
  mockFrom.mockImplementation((table: string) => {
    if (overrides[table]) return createChainMock(overrides[table]);
    return createChainMock([]);
  });
};

describe("processDripEmails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendEmail.mockResolvedValue({ success: true, emailId: "re_123" });
    mockInsertEmailSend.mockResolvedValue(true);
  });

  it("should return early when no active installations", async () => {
    mockTables();

    const result = await processDripEmails();

    expect(result.sent).toBe(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("should send onboarding email on correct day", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(2) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [{ user_id: 42, email: "test@example.com", user_name: "Test User" }],
      total_repo_coverage: [{ owner_id: 100, statement_coverage: 65, coverage_date: "2026-02-20" }],
      repo_coverage: [{ owner_id: 100, repo_name: "api" }],
    });
    mockGetSentEmails.mockResolvedValue({});

    const result = await processDripEmails();

    // Day 2 >= slot 0 day (1), hasOwnerCoverage=true → review_setup_pr skipped, coverage_charts sent
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    // TODO: Restore to: ["test@example.com"] after dry run
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("coverage"),
      }),
    );
    expect(result.sent).toBe(1);
  });

  it("should send auto-setup prompt when no setup PRs and no coverage", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(5) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [{ user_id: 42, email: "test@example.com", user_name: "Test User" }],
    });
    mockGetSentEmails.mockResolvedValue({});

    const result = await processDripEmails();

    // No coverage, no setup PRs → review_setup_pr sends auto-setup prompt, then coverage_charts pauses
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Set up test coverage"),
      }),
    );
    expect(result.sent).toBe(1);
  });

  it("should pause at coverage_charts when coverage data is missing", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(5) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [{ user_id: 42, email: "test@example.com", user_name: "Test User" }],
    });
    mockGetSentEmails.mockResolvedValue({
      100: new Set(["onboarding_review_setup_pr"]),
    });

    const result = await processDripEmails();

    // review_setup_pr already sent, coverage_charts pauses (no coverage) → no email
    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(result.sent).toBe(0);
  });

  it("should skip already sent emails (idempotency)", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(2) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [{ user_id: 42, email: "test@example.com", user_name: "Test User" }],
      total_repo_coverage: [{ owner_id: 100, statement_coverage: 65, coverage_date: "2026-02-20" }],
    });
    // hasOwnerCoverage=true → review_setup_pr skipped, coverage_charts is slot 0
    // Mark coverage_charts as already sent
    mockGetSentEmails.mockResolvedValue({
      100: new Set(["onboarding_coverage_charts"]),
    });

    const result = await processDripEmails();

    // Day 2, slot 0 = coverage_charts (already sent), slot 1 = set_target_branch (day 3) → too early
    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(result.sent).toBe(0);
  });

  it("should skip owners without email", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(2) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [],
    });
    mockGetSentEmails.mockResolvedValue({});

    const result = await processDripEmails();

    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(result.sent).toBe(0);
  });

  it("should move up schedule when earlier email is skipped", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(3) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [{ user_id: 42, email: "test@example.com", user_name: "Test User" }],
      total_repo_coverage: [{ owner_id: 100, statement_coverage: 50, coverage_date: "2026-02-20" }],
      repo_coverage: [{ owner_id: 100, repo_name: "api" }],
    });
    mockGetSentEmails.mockResolvedValue({
      100: new Set(["onboarding_review_setup_pr", "onboarding_coverage_charts"]),
    });

    const result = await processDripEmails();

    // review_setup_pr already sent, coverage_charts already sent, set_target_branch moves to slot 1 (day 3)
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("branch"),
      }),
    );
    expect(result.sent).toBe(1);
  });

  it("should send coverage threshold when all onboarding is done", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(60) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [{ user_id: 42, email: "test@example.com", user_name: "Test User" }],
      total_repo_coverage: [
        { owner_id: 100, statement_coverage: 76.5, coverage_date: "2026-02-20" },
      ],
      usage: [
        {
          owner_id: 100,
          trigger: "issue",
          owner_name: "test-org",
          repo_name: "api",
          pr_number: 1,
          is_merged: true,
          created_at: daysAgo(1),
        },
      ],
    });
    mockGetSentEmails.mockResolvedValue({
      100: new Set([
        "onboarding_review_setup_pr",
        "onboarding_coverage_charts",
        "onboarding_set_target_branch",
        "onboarding_merge_test_pr",
        "onboarding_purchase_credits",
      ]),
    });

    const result = await processDripEmails();

    // coverage_50_pct (76.5 >= 50, < 80)
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("77%"),
      }),
    );
    expect(result.sent).toBe(1);
  });

  it("should skip owners without created_by", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(2) },
      ],
      owners: [{ owner_id: 100, created_by: null }],
      users: [],
    });
    mockGetSentEmails.mockResolvedValue({});

    const result = await processDripEmails();

    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(result.sent).toBe(0);
  });

  it("should send dormant reintro email for dormant user with no activity", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(30) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [{ user_id: 42, email: "test@example.com", user_name: "Test User" }],
    });
    mockGetSentEmails.mockResolvedValue({});

    const result = await processDripEmails();

    // Dormant (30 days, no PRs) → dormant reintro sent before onboarding
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Still interested"),
      }),
    );
    expect(result.sent).toBe(1);
  });

  it("should skip onboarding for dormant user when reintro already sent", async () => {
    mockTables({
      installations: [
        { installation_id: 1, owner_id: 100, owner_name: "test-org", created_at: daysAgo(30) },
      ],
      owners: [{ owner_id: 100, created_by: "42:testuser" }],
      users: [{ user_id: 42, email: "test@example.com", user_name: "Test User" }],
    });
    mockGetSentEmails.mockResolvedValue({
      100: new Set(["dormant_reintro"]),
    });

    const result = await processDripEmails();

    // Dormant + reintro already sent → skip all emails
    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(result.sent).toBe(0);
  });

  it("subscriber: purchase_credits NOT sent even with $0 balance", async () => {
    mockGetActiveSubCustomerIds.mockResolvedValue(new Set(["cus_spiderplus"]));
    mockTables({
      installations: [
        { installation_id: 3, owner_id: 300, owner_name: "spiderplus", created_at: daysAgo(10) },
      ],
      owners: [
        {
          owner_id: 300,
          created_by: "106721599:jun-honda-spiderplus",
          credit_balance_usd: 0,
          stripe_customer_id: "cus_spiderplus",
        },
      ],
      users: [
        {
          user_id: 106721599,
          email: "jun.honda@spiderplus.co.jp",
          user_name: "jun-honda-spiderplus",
        },
      ],
      usage: [
        {
          owner_id: 300,
          trigger: "issue",
          owner_name: "spiderplus",
          repo_name: "api",
          pr_number: 1,
          is_merged: true,
          created_at: daysAgo(1),
        },
      ],
    });
    mockGetSentEmails.mockResolvedValue({
      300: new Set([
        "onboarding_review_setup_pr",
        "onboarding_coverage_charts",
        "onboarding_set_target_branch",
        "onboarding_merge_test_pr",
      ]),
    });

    const result = await processDripEmails();

    // purchase_credits is the only onboarding left, but skipped due to subscription
    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(result.sent).toBe(0);
  });
});

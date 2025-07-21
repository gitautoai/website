import { insertCredits } from "./insert-credits";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("insertCredits integration", () => {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 100000; // GitHub-like ID

  afterEach(async () => {
    // Cleanup test data
    await supabaseAdmin.from("credits").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);
  });

  beforeEach(async () => {
    // Create test owner
    await supabaseAdmin.from("owners").insert({
      owner_id: testOwnerId,
      owner_name: `test-user-${testOwnerId}`,
      owner_type: "User",
      stripe_customer_id: `cus_test_${testOwnerId}`,
      credit_balance_usd: 0,
      auto_reload_enabled: false,
      auto_reload_threshold_usd: 10,
      auto_reload_target_usd: 50,
      org_rules: "",
    });
  });

  it("should add credits to database and update owner balance", async () => {
    await insertCredits({
      owner_id: testOwnerId,
      amount_usd: 50,
      transaction_type: "purchase",
      stripe_payment_intent_id: "pi_test_123",
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Verify credit record was created
    const { data: credits } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("owner_id", testOwnerId);

    expect(credits).toHaveLength(1);
    expect(credits![0].amount_usd).toBe(50);
    expect(credits![0].transaction_type).toBe("purchase");

    // Verify owner balance was updated by trigger
    const { data: owner } = await supabaseAdmin
      .from("owners")
      .select("credit_balance_usd")
      .eq("owner_id", testOwnerId)
      .single();

    expect(owner!.credit_balance_usd).toBe(50);
  });

  it("should handle usage transactions with negative amounts", async () => {
    // First create a usage record to reference
    const { data: usage } = await supabaseAdmin
      .from("usage")
      .insert({
        user_id: testOwnerId,
        installation_id: 12345,
        owner_id: testOwnerId,
        owner_name: `test-user-${testOwnerId}`,
        repo_id: 67890,
        repo_name: "test-repo",
        issue_number: 1,
      })
      .select()
      .single();

    await insertCredits({
      owner_id: testOwnerId,
      amount_usd: -10,
      transaction_type: "usage",
      usage_id: usage!.id,
    });

    const { data: credits } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("owner_id", testOwnerId);

    expect(credits![0].amount_usd).toBe(-10);
    expect(credits![0].transaction_type).toBe("usage");
    expect(credits![0].usage_id).toBe(usage!.id);

    // Cleanup usage record
    await supabaseAdmin.from("usage").delete().eq("id", usage!.id);
  });

  it("should fail with real database constraint violations", async () => {
    // Try to add credit for non-existent owner
    const nonExistentOwnerId = 999999999;

    await expect(
      insertCredits({
        owner_id: nonExistentOwnerId,
        amount_usd: 50,
        transaction_type: "purchase",
      })
    ).rejects.toThrow();
  });

  it("should handle auto-reload transactions", async () => {
    await insertCredits({
      owner_id: testOwnerId,
      amount_usd: 25,
      transaction_type: "auto_reload",
      stripe_payment_intent_id: "pi_auto_123",
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const { data: credits } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("owner_id", testOwnerId);

    expect(credits![0].transaction_type).toBe("auto_reload");
  });
});

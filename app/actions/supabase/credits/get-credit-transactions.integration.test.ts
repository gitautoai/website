import { getCreditTransactions } from "./get-credit-transactions";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("getCreditTransactions integration", () => {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 300000; // GitHub-like ID

  afterEach(async () => {
    // Cleanup test data
    await supabaseAdmin.from("credits").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);
  });

  beforeEach(async () => {
    // Create test owner
    await supabaseAdmin.from("owners").insert({
      owner_id: testOwnerId,
      owner_name: `testuser${testOwnerId}`,
      owner_type: "User",
      stripe_customer_id: `cus_test_${testOwnerId}`,
      credit_balance_usd: 0,
      auto_reload_enabled: false,
      auto_reload_threshold_usd: 10,
      auto_reload_target_usd: 50,
      org_rules: "",
    });
  });

  it("should return transactions ordered by created_at desc", async () => {
    // Create multiple transactions with different timestamps
    const transactions = [
      { amount_usd: 100, transaction_type: "purchase" as const },
      { amount_usd: -10, transaction_type: "usage" as const },
      { amount_usd: 25, transaction_type: "auto_reload" as const },
    ];

    for (let index = 0; index < transactions.length; index++) {
      await supabaseAdmin.from("credits").insert({
        owner_id: testOwnerId,
        ...transactions[index],
        created_at: new Date(Date.now() - (transactions.length - index) * 1000).toISOString(),
      });
    }

    const result = await getCreditTransactions(testOwnerId);

    expect(result).toHaveLength(3);
    expect(result[0].transaction_type).toBe("auto_reload"); // Most recent
    expect(result[1].transaction_type).toBe("usage");
    expect(result[2].transaction_type).toBe("purchase"); // Oldest
  });

  it("should respect limit parameter", async () => {
    // Create 5 transactions
    for (let i = 0; i < 5; i++) {
      await supabaseAdmin.from("credits").insert({
        owner_id: testOwnerId,
        amount_usd: i * 10,
        transaction_type: "purchase",
        created_at: new Date(Date.now() - i * 1000).toISOString(),
      });
    }

    const result = await getCreditTransactions(testOwnerId, 3);
    expect(result).toHaveLength(3);
  });

  it("should return empty array for owner with no transactions", async () => {
    const result = await getCreditTransactions(testOwnerId);
    expect(result).toEqual([]);
  });

  it("should only return transactions for specified owner", async () => {
    const otherOwnerId = testOwnerId + 1;

    // Create another owner
    await supabaseAdmin.from("owners").insert({
      owner_id: otherOwnerId,
      owner_name: `testuser${otherOwnerId}`,
      owner_type: "User",
      stripe_customer_id: `cus_test_${otherOwnerId}`,
      credit_balance_usd: 0,
      auto_reload_enabled: false,
      auto_reload_threshold_usd: 10,
      auto_reload_target_usd: 50,
      org_rules: "",
    });

    // Add transactions for both owners
    await supabaseAdmin.from("credits").insert([
      { owner_id: testOwnerId, amount_usd: 50, transaction_type: "purchase" },
      { owner_id: otherOwnerId, amount_usd: 100, transaction_type: "purchase" },
    ]);

    const result = await getCreditTransactions(testOwnerId);
    expect(result).toHaveLength(1);
    expect(result[0].owner_id).toBe(testOwnerId);

    // Cleanup other owner
    await supabaseAdmin.from("credits").delete().eq("owner_id", otherOwnerId);
    await supabaseAdmin.from("owners").delete().eq("owner_id", otherOwnerId);
  });

  it("should include all transaction fields", async () => {
    await supabaseAdmin.from("credits").insert({
      owner_id: testOwnerId,
      amount_usd: 50,
      transaction_type: "usage",
      usage_id: null,
      stripe_payment_intent_id: "pi_test_123",
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const result = await getCreditTransactions(testOwnerId);
    expect(result[0]).toMatchObject({
      owner_id: testOwnerId,
      amount_usd: 50,
      transaction_type: "usage",
      usage_id: null,
      stripe_payment_intent_id: "pi_test_123",
    });
    expect(result[0].expires_at).toBeTruthy();
    expect(result[0].created_at).toBeTruthy();
  });
});

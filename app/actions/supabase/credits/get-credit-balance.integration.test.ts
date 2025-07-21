import { getCreditBalance } from "./get-credit-balance";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("getCreditBalance integration", () => {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 200000; // GitHub-like ID

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

  it("should return correct balance from owner table", async () => {
    // Add some credits to update balance
    await supabaseAdmin.from("credits").insert([
      {
        owner_id: testOwnerId,
        amount_usd: 50,
        transaction_type: "purchase",
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        owner_id: testOwnerId,
        amount_usd: -10,
        transaction_type: "usage",
      },
    ]);

    // Wait for trigger to update owner balance
    await new Promise((resolve) => setTimeout(resolve, 100));

    const balance = await getCreditBalance(testOwnerId);
    expect(balance).toBe(40); // 50 - 10
  });

  it("should return 0 for owner with no credits", async () => {
    const balance = await getCreditBalance(testOwnerId);
    expect(balance).toBe(0);
  });

  it("should throw error for non-existent owner", async () => {
    const nonExistentOwnerId = 999999999;

    await expect(getCreditBalance(nonExistentOwnerId)).rejects.toThrow(
      "Failed to get credit balance"
    );
  });

  it("should handle multiple credit transactions correctly", async () => {
    // Add multiple transactions
    await supabaseAdmin.from("credits").insert([
      { owner_id: testOwnerId, amount_usd: 100, transaction_type: "purchase" },
      { owner_id: testOwnerId, amount_usd: -20, transaction_type: "usage" },
      { owner_id: testOwnerId, amount_usd: 25, transaction_type: "auto_reload" },
      { owner_id: testOwnerId, amount_usd: -5, transaction_type: "usage" },
    ]);

    // Wait for trigger to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    const balance = await getCreditBalance(testOwnerId);
    expect(balance).toBe(100); // 100 - 20 + 25 - 5
  });
});

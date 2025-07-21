import { checkAllAutoReloads } from "./check-all-auto-reloads";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("checkAllAutoReloads integration", () => {
  jest.setTimeout(15000);
  let testOwnerIds: number[];

  beforeEach(async () => {
    const uniqueBase = Date.now();
    testOwnerIds = [uniqueBase * 1000 + 1, uniqueBase * 1000 + 2, uniqueBase * 1000 + 3];
  });

  afterEach(async () => {
    if (testOwnerIds) {
      for (const ownerId of testOwnerIds) {
        await supabaseAdmin.from("owners").delete().eq("owner_id", ownerId);
      }
    }
  });

  it("should process multiple eligible owners", async () => {
    // Create owners that need auto-reload (balance <= threshold)
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerIds[0],
        owner_name: `testuser${testOwnerIds[0]}`,
        owner_type: "User",
        stripe_customer_id: `cus_test_${testOwnerIds[0]}`,
        credit_balance_usd: 5,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      },
      {
        owner_id: testOwnerIds[1],
        owner_name: `testuser${testOwnerIds[1]}`,
        owner_type: "User",
        stripe_customer_id: `cus_test_${testOwnerIds[1]}`,
        credit_balance_usd: 8,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      },
    ]);

    const result = await checkAllAutoReloads();

    expect(result.success).toBe(true);

    // Filter results to only our test owners
    const ourResults = result.results.filter((r) => testOwnerIds.includes(r.ownerId));

    expect(ourResults.length).toBe(2);

    // Both should fail because fake Stripe customer IDs
    ourResults.forEach((ownerResult) => {
      expect(ownerResult.success).toBe(false);
      expect(ownerResult.error).toContain("No such customer:");
    });
  });

  it("should not process owners with auto-reload disabled", async () => {
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerIds[0],
        owner_name: `testuser${testOwnerIds[0]}`,
        owner_type: "User",
        stripe_customer_id: `cus_test_${testOwnerIds[0]}`,
        credit_balance_usd: 5,
        auto_reload_enabled: false, // Disabled
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      },
    ]);

    const result = await checkAllAutoReloads();

    expect(result.success).toBe(true);

    // Should not process our disabled owner
    const ourResults = result.results.filter((r) => testOwnerIds.includes(r.ownerId));
    expect(ourResults.length).toBe(0);
  });

  it("should not process owners with balance above threshold", async () => {
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerIds[0],
        owner_name: `testuser${testOwnerIds[0]}`,
        owner_type: "User",
        stripe_customer_id: `cus_test_${testOwnerIds[0]}`,
        credit_balance_usd: 15, // Above threshold
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      },
    ]);

    const result = await checkAllAutoReloads();

    expect(result.success).toBe(true);

    // Should not process our owner (balance above threshold)
    const ourResults = result.results.filter((r) => testOwnerIds.includes(r.ownerId));
    expect(ourResults.length).toBe(0);
  });

  it("should handle Stripe customer not found errors", async () => {
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerIds[0],
        owner_name: `testuser${testOwnerIds[0]}`,
        owner_type: "User",
        stripe_customer_id: `cus_test_${testOwnerIds[0]}`,
        credit_balance_usd: 5,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      },
    ]);

    const result = await checkAllAutoReloads();

    expect(result.success).toBe(true);

    // Filter results to only our test owners
    const ourResults = result.results.filter((r) => testOwnerIds.includes(r.ownerId));

    expect(ourResults.length).toBe(1);
    expect(ourResults[0]).toMatchObject({
      ownerId: testOwnerIds[0],
      success: false,
      error: expect.stringContaining("No such customer:"),
    });
  });

  it("should process owners with balance equal to threshold", async () => {
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerIds[0],
        owner_name: `testuser${testOwnerIds[0]}`,
        owner_type: "User",
        stripe_customer_id: `cus_test_${testOwnerIds[0]}`,
        credit_balance_usd: 10, // Equal to threshold
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      },
    ]);

    const result = await checkAllAutoReloads();

    expect(result.success).toBe(true);

    // Filter results to only our test owners
    const ourResults = result.results.filter((r) => testOwnerIds.includes(r.ownerId));

    expect(ourResults.length).toBe(1);
    expect(ourResults[0]).toMatchObject({
      ownerId: testOwnerIds[0],
      success: false,
      error: expect.stringContaining("No such customer:"), // Fake Stripe customer ID
    });
  });

  it("should return empty results when no owners need auto-reload", async () => {
    // Create owners that don't need auto-reload
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerIds[0],
        owner_name: `testuser${testOwnerIds[0]}`,
        owner_type: "User",
        stripe_customer_id: `cus_test_${testOwnerIds[0]}`,
        credit_balance_usd: 50,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      },
    ]);

    const result = await checkAllAutoReloads();

    expect(result.success).toBe(true);

    // Should not process our owner (balance above threshold)
    const ourResults = result.results.filter((r) => testOwnerIds.includes(r.ownerId));
    expect(ourResults.length).toBe(0);
  });

  it("should handle edge case where target equals current balance", async () => {
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerIds[0],
        owner_name: `testuser${testOwnerIds[0]}`,
        owner_type: "User",
        stripe_customer_id: `cus_test_${testOwnerIds[0]}`,
        credit_balance_usd: 25,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 30,
        auto_reload_target_usd: 25, // Same as current balance
        org_rules: "",
      },
    ]);

    const result = await checkAllAutoReloads();

    expect(result.success).toBe(true);

    // Filter results to only our test owners
    const ourResults = result.results.filter((r) => testOwnerIds.includes(r.ownerId));

    expect(ourResults.length).toBe(1);
    expect(ourResults[0]).toMatchObject({
      ownerId: testOwnerIds[0],
      success: false,
      reason: "Target amount would be negative or zero",
    });
  });

  it("should not process owners without Stripe customer ID", async () => {
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerIds[0],
        owner_name: `testuser${testOwnerIds[0]}`,
        owner_type: "User",
        stripe_customer_id: "",
        credit_balance_usd: 5,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      },
    ]);

    const result = await checkAllAutoReloads();

    expect(result.success).toBe(true);

    const ourResults = result.results.filter((r) => testOwnerIds.includes(r.ownerId));
    expect(ourResults.length).toBe(0);
  });
});

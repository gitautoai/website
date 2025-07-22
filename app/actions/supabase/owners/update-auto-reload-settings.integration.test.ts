import { updateAutoReloadSettings } from "./update-auto-reload-settings";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("updateAutoReloadSettings integration", () => {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 400000; // GitHub-like ID

  afterEach(async () => {
    // Cleanup test data
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);
  });

  beforeEach(async () => {
    // Create test owner with default auto-reload settings
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

  it("should update all auto-reload settings correctly", async () => {
    await updateAutoReloadSettings({
      ownerId: testOwnerId,
      enabled: true,
      thresholdUsd: 20,
      amountUsd: 100,
    });

    const { data: owner } = await supabaseAdmin
      .from("owners")
      .select("auto_reload_enabled, auto_reload_threshold_usd, auto_reload_target_usd")
      .eq("owner_id", testOwnerId)
      .single();

    expect(owner!.auto_reload_enabled).toBe(true);
    expect(owner!.auto_reload_threshold_usd).toBe(20);
    expect(owner!.auto_reload_target_usd).toBe(100);
  });

  it("should disable auto-reload when enabled is false", async () => {
    // First enable it
    await updateAutoReloadSettings({
      ownerId: testOwnerId,
      enabled: true,
      thresholdUsd: 15,
      amountUsd: 75,
    });

    // Then disable it
    await updateAutoReloadSettings({
      ownerId: testOwnerId,
      enabled: false,
      thresholdUsd: 25,
      amountUsd: 125,
    });

    const { data: owner } = await supabaseAdmin
      .from("owners")
      .select("auto_reload_enabled, auto_reload_threshold_usd, auto_reload_target_usd")
      .eq("owner_id", testOwnerId)
      .single();

    expect(owner!.auto_reload_enabled).toBe(false);
    expect(owner!.auto_reload_threshold_usd).toBe(25);
    expect(owner!.auto_reload_target_usd).toBe(125);
  });

  it("should handle integer dollar amounts correctly", async () => {
    await updateAutoReloadSettings({
      ownerId: testOwnerId,
      enabled: true,
      thresholdUsd: 5,
      amountUsd: 100,
    });

    const { data: owner } = await supabaseAdmin
      .from("owners")
      .select("auto_reload_threshold_usd, auto_reload_target_usd")
      .eq("owner_id", testOwnerId)
      .single();

    expect(owner!.auto_reload_threshold_usd).toBe(5);
    expect(owner!.auto_reload_target_usd).toBe(100);
  });

  it("should throw error for non-existent owner", async () => {
    const nonExistentOwnerId = 999999999;

    await expect(
      updateAutoReloadSettings({
        ownerId: nonExistentOwnerId,
        enabled: true,
        thresholdUsd: 10,
        amountUsd: 50,
      })
    ).rejects.toThrow("Owner with ID 999999999 not found");
  });

  it("should not affect other owner fields", async () => {
    const originalOwner = await supabaseAdmin
      .from("owners")
      .select("*")
      .eq("owner_id", testOwnerId)
      .single();

    await updateAutoReloadSettings({
      ownerId: testOwnerId,
      enabled: true,
      thresholdUsd: 30,
      amountUsd: 150,
    });

    const { data: updatedOwner } = await supabaseAdmin
      .from("owners")
      .select("*")
      .eq("owner_id", testOwnerId)
      .single();

    // Check that other fields weren't modified
    expect(updatedOwner!.owner_name).toBe(originalOwner.data!.owner_name);
    expect(updatedOwner!.stripe_customer_id).toBe(originalOwner.data!.stripe_customer_id);
    expect(updatedOwner!.credit_balance_usd).toBe(originalOwner.data!.credit_balance_usd);

    // Check that only auto-reload fields were updated
    expect(updatedOwner!.auto_reload_enabled).toBe(true);
    expect(updatedOwner!.auto_reload_threshold_usd).toBe(30);
    expect(updatedOwner!.auto_reload_target_usd).toBe(150);
  });
});

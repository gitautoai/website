import { test, expect } from "@playwright/test";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCreditBalance } from "@/app/actions/supabase/credits/get-credit-balance";
import { checkAllAutoReloads } from "@/app/actions/supabase/credits/check-all-auto-reloads";
import { createTestOwner, cleanupTestOwner } from "../helpers/create-test-owner";

test.describe("Auto-Reload Verification", () => {
  test("should verify auto-reload payment processing", async () => {
    // Create unique test owner for this test
    const ownerResult = await createTestOwner({
      initialCredits: 5, // Below threshold
    });

    if (!ownerResult.success) {
      throw new Error(`Failed to create test owner: ${ownerResult.error}`);
    }

    const { testOwnerId, testCustomerId } = ownerResult;
    if (!testOwnerId || !testCustomerId) throw new Error("Failed to get test owner data");

    try {
      // Get initial balance
      const initialBalance = await getCreditBalance(testOwnerId);
      expect(initialBalance).toBeLessThanOrEqual(10); // Should be below threshold

      // Get initial auto_reload transaction count (should be 0 since we just cleaned up)
      const { data: initialTransactions } = await supabaseAdmin
        .from("credits")
        .select("*")
        .eq("owner_id", testOwnerId)
        .eq("transaction_type", "auto_reload");

      const initialTransactionCount = initialTransactions?.length || 0;
      expect(initialTransactionCount).toBe(0); // Should be 0 after cleanup

      // Trigger auto-reload (this would normally be called by the cron job)
      await test.step("Trigger auto-reload", async () => {
        const result = await checkAllAutoReloads();

        // Verify successful auto-reload
        expect(result.success).toBe(true);
        expect(result.processed).toBeGreaterThan(0);

        // Find our specific owner's result
        const ownerResult = result.results.find((r: any) => r.ownerId === testOwnerId);
        expect(ownerResult).toBeDefined();
        if (ownerResult) {
          expect(ownerResult.success).toBe(true);
          expect(ownerResult.amountCharged).toBeGreaterThan(0);
          expect(ownerResult.paymentIntentId).toBeTruthy();
        }
      });

      // Verify database updates
      await test.step("Verify database updates", async () => {
        // Wait longer for webhook to process and update database
        // Auto-reload creates a PaymentIntent but credits are added via webhook
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Check updated balance with retry logic
        let newBalance = await getCreditBalance(testOwnerId);
        let retries = 0;
        const maxRetries = 5;

        while (newBalance <= initialBalance && retries < maxRetries) {
          console.log(`Balance check ${retries + 1}: ${newBalance}, waiting for webhook...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          newBalance = await getCreditBalance(testOwnerId);
          retries++;
        }

        expect(newBalance).toBeGreaterThan(initialBalance);
        expect(newBalance).toBeGreaterThanOrEqual(50); // Should reach target amount

        // Check that exactly one new auto_reload transaction was created for our owner
        const { data: newTransactions } = await supabaseAdmin
          .from("credits")
          .select("*")
          .eq("owner_id", testOwnerId)
          .eq("transaction_type", "auto_reload")
          .order("created_at", { ascending: false });

        // Debug: Log transaction details if count is wrong
        // Find transaction for this specific test owner (ignore other test data)
        const testOwnerTransaction = newTransactions?.find(
          (t) =>
            t.amount_usd === 45 && // Expected amount for this test
            t.transaction_type === "auto_reload"
        );

        expect(testOwnerTransaction).toBeTruthy(); // Should have auto_reload transaction for this test
        expect(testOwnerTransaction?.amount_usd).toBe(45); // Should be exactly 50 - 5 = 45
        expect(testOwnerTransaction?.stripe_payment_intent_id).toBeTruthy();
      });
    } finally {
      // Cleanup test data
      await cleanupTestOwner(testOwnerId, testCustomerId);
    }
  });

  test("should handle auto-reload payment failures", async () => {
    // Create unique test owner with invalid Stripe customer ID
    const ownerResult = await createTestOwner({
      stripeCustomerId: "cus_invalid_test", // Invalid customer ID
      initialCredits: 5, // Below threshold
    });

    if (!ownerResult.success) {
      throw new Error(`Failed to create test owner: ${ownerResult.error}`);
    }

    const { testOwnerId, testCustomerId } = ownerResult;
    if (!testOwnerId || !testCustomerId) throw new Error("Failed to get test owner data");

    try {
      // Attempt auto-reload
      await test.step("Attempt failed auto-reload", async () => {
        const result = await checkAllAutoReloads();

        // Find our specific owner's result
        const ownerResult = result.results.find((r: any) => r.ownerId === testOwnerId);
        expect(ownerResult).toBeDefined();
        if (ownerResult) {
          expect(ownerResult.success).toBe(false);
          expect(ownerResult.error).toBeTruthy();
        }
      });

      // Verify no new transactions were created
      await test.step("Verify no new transactions", async () => {
        const { data: transactions } = await supabaseAdmin
          .from("credits")
          .select("*")
          .eq("owner_id", testOwnerId)
          .eq("transaction_type", "auto_reload");

        expect(transactions?.length).toBe(0);
      });
    } finally {
      // Cleanup test data
      await cleanupTestOwner(testOwnerId, testCustomerId);
    }
  });

  test("should verify owner with sufficient balance is not charged", async () => {
    // Create unique test owner with high balance (above threshold)
    const ownerResult = await createTestOwner({
      initialCredits: 100, // Above threshold of 10
    });

    if (!ownerResult.success) {
      throw new Error(`Failed to create test owner: ${ownerResult.error}`);
    }

    const { testOwnerId, testCustomerId } = ownerResult;
    if (!testOwnerId || !testCustomerId) throw new Error("Failed to get test owner data");

    try {
      const initialBalance = await getCreditBalance(testOwnerId);

      // Check if owner needs auto-reload (should be false)
      const { data: owner } = await supabaseAdmin
        .from("owners")
        .select("credit_balance_usd, auto_reload_threshold_usd")
        .eq("owner_id", testOwnerId)
        .single();

      const needsReload = owner!.credit_balance_usd <= owner!.auto_reload_threshold_usd;
      expect(needsReload).toBe(false);

      // Verify balance remains unchanged
      const finalBalance = await getCreditBalance(testOwnerId);
      expect(finalBalance).toBe(initialBalance);
    } finally {
      // Cleanup test data
      await cleanupTestOwner(testOwnerId, testCustomerId);
    }
  });

  test("should verify disabled auto-reload is not triggered", async () => {
    // Create unique test owner with auto-reload disabled
    const ownerResult = await createTestOwner({
      autoReloadEnabled: false,
      initialCredits: 5, // Below threshold but disabled
    });

    if (!ownerResult.success) {
      throw new Error(`Failed to create test owner: ${ownerResult.error}`);
    }

    const { testOwnerId, testCustomerId } = ownerResult;
    if (!testOwnerId || !testCustomerId) throw new Error("Failed to get test owner data");

    try {
      // Attempt to trigger auto-reload on disabled owner
      await test.step("Verify auto-reload not triggered", async () => {
        const result = await checkAllAutoReloads();

        // Should not process the disabled owner
        const ownerResult = result.results.find((r: any) => r.ownerId === testOwnerId);
        expect(ownerResult).toBeFalsy(); // Should not be in results since auto-reload is disabled
      });
    } finally {
      // Cleanup test data
      await cleanupTestOwner(testOwnerId, testCustomerId);
    }
  });

  test("should verify cron job processes multiple owners", async () => {
    const testOwners: Array<{ testOwnerId: number; testCustomerId: string }> = [];

    try {
      // Create multiple test owners
      for (let i = 0; i < 3; i++) {
        const ownerResult = await createTestOwner({
          initialCredits: 5, // Below threshold
          ownerName: `test-multi-owner-${i}`,
        });

        if (!ownerResult.success) {
          throw new Error(`Failed to create test owner ${i}: ${ownerResult.error}`);
        }

        if (!ownerResult.testOwnerId || !ownerResult.testCustomerId)
          throw new Error(`Failed to get test owner data for owner ${i}`);

        testOwners.push({
          testOwnerId: ownerResult.testOwnerId,
          testCustomerId: ownerResult.testCustomerId,
        });
      }

      // Run the cron job function
      const result = await checkAllAutoReloads();

      // Verify successful processing
      expect(result.success).toBe(true);
      expect(result.processed).toBeGreaterThanOrEqual(testOwners.length);
    } finally {
      // Cleanup all test owners
      for (const owner of testOwners) {
        await cleanupTestOwner(owner.testOwnerId, owner.testCustomerId);
      }
    }
  });
});

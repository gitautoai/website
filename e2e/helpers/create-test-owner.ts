import { supabaseAdmin } from "@/lib/supabase/server";
import { insertCredits } from "@/app/actions/supabase/credits/insert-credits";
import { createTestCustomer } from "./create-test-customer";
import stripe from "@/lib/stripe";

export interface TestOwnerOptions {
  autoReloadEnabled?: boolean;
  autoReloadThreshold?: number;
  autoReloadTarget?: number;
  initialCredits?: number;
  stripeCustomerId?: string;
  ownerName?: string;
}

export interface TestOwnerResult {
  success: boolean;
  testOwnerId?: number;
  testCustomerId?: string;
  error?: string;
}

export async function createTestOwner(options: TestOwnerOptions = {}): Promise<TestOwnerResult> {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 10000000;
  let testCustomerId: string | undefined;

  try {
    // Clean up any existing data for this test owner first
    await supabaseAdmin.from("credits").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);

    // Create Stripe customer if not provided
    if (options.stripeCustomerId) {
      testCustomerId = options.stripeCustomerId;
    } else {
      const customerResult = await createTestCustomer({
        ownerId: testOwnerId.toString(),
        testName: "auto-reload-test",
      });

      if (!customerResult.success) {
        return {
          success: false,
          error: `Failed to create test customer: ${customerResult.error}`,
        };
      }

      testCustomerId = customerResult.customerId!;
    }

    // Set up test owner
    await supabaseAdmin.from("owners").upsert({
      owner_id: testOwnerId,
      owner_name: options.ownerName || `test-owner-${testOwnerId}`,
      owner_type: "User",
      stripe_customer_id: testCustomerId,
      credit_balance_usd: 0, // Will be set by trigger
      auto_reload_enabled: options.autoReloadEnabled ?? true,
      auto_reload_threshold_usd: options.autoReloadThreshold ?? 10,
      auto_reload_target_usd: options.autoReloadTarget ?? 50,
      org_rules: "",
    });

    // Insert initial credits if specified
    if (options.initialCredits && options.initialCredits > 0) {
      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: options.initialCredits,
        transaction_type: "purchase",
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Verify owner was created
    const { data: verifyOwner } = await supabaseAdmin
      .from("owners")
      .select("owner_id")
      .eq("owner_id", testOwnerId)
      .single();

    if (!verifyOwner) {
      throw new Error(`Failed to verify owner ${testOwnerId} was created`);
    }

    // Wait for database transaction to be visible to other connections
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      testOwnerId,
      testCustomerId,
    };
  } catch (error) {
    console.error("Error creating test owner:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function cleanupTestOwner(testOwnerId: number, testCustomerId?: string) {
  try {
    // Cleanup database records
    await supabaseAdmin.from("credits").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);

    // Cleanup Stripe customer if provided
    if (testCustomerId) {
      try {
        await stripe.customers.del(testCustomerId);
      } catch (error) {
        console.warn("Failed to cleanup test customer:", error);
      }
    }
  } catch (error) {
    console.warn("Failed to cleanup test owner:", error);
  }
}
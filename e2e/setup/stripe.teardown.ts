import fs from "fs/promises";
import path from "path";
import { FullConfig } from "@playwright/test";
import { supabaseAdmin } from "@/lib/supabase/server";
import Stripe from "stripe";

async function globalTeardown(config: FullConfig) {
  // Stop Stripe webhook listener
  const stripePid = process.env.STRIPE_PROCESS_PID;
  if (stripePid) {
    try {
      process.kill(parseInt(stripePid), "SIGTERM");
    } catch (error) {
      // Silently handle cleanup errors
    }
  }

  // Clean up test data created by auth.setup.ts
  try {
    const authDir = path.join(process.cwd(), "e2e", ".auth");
    const testIdsFile = path.join(authDir, "test-ids.json");
    const testIdsContent = await fs.readFile(testIdsFile, "utf-8");
    const TEST_IDS = JSON.parse(testIdsContent);

    const userId = TEST_IDS.regularWithCredits.userId;
    const legacyUserId = TEST_IDS.legacyWithSubscription.userId;

    // Clean up database records
    await supabaseAdmin.from("credits").delete().in("owner_id", [userId, legacyUserId]);
    await supabaseAdmin.from("installations").delete().in("owner_id", [userId, legacyUserId]);

    // Get Stripe customer IDs before deleting owners
    const { data: owners } = await supabaseAdmin
      .from("owners")
      .select("stripe_customer_id")
      .in("owner_id", [userId, legacyUserId]);

    const customerIds = owners?.map((o) => o.stripe_customer_id).filter(Boolean) || [];

    await supabaseAdmin.from("owners").delete().in("owner_id", [userId, legacyUserId]);

    // Clean up Stripe customers
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    for (const customerId of customerIds) {
      try {
        await stripe.customers.del(customerId);
      } catch (error) {
        console.error(`Failed to delete Stripe customer ${customerId}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to clean up test data:", error);
  }
}

export default globalTeardown;

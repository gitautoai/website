"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { chargeSavedPaymentMethod } from "@/app/actions/stripe/charge-saved-payment-method";
import { slackUs } from "@/app/actions/slack/slack-us";
import { validateAutoReloadSpendingLimit } from "./validate-spending-limit";

export async function checkAllAutoReloads() {
  try {
    // Get all owners with auto-reload enabled and all necessary data in one query
    const { data: owners, error } = await supabaseAdmin
      .from("owners")
      .select(
        `
        owner_id,
        credit_balance_usd,
        auto_reload_threshold_usd,
        auto_reload_target_usd,
        stripe_customer_id
      `
      )
      .eq("auto_reload_enabled", true)
      .neq("stripe_customer_id", "");

    if (error) throw new Error(`Failed to fetch owners for auto-reload: ${error.message}`);

    // Filter to owners with balance below threshold
    const eligibleOwners = owners.filter(
      (owner) => owner.credit_balance_usd <= owner.auto_reload_threshold_usd
    );

    console.log(`Found ${eligibleOwners.length} owners eligible for auto-reload`);

    const results = [];

    for (const owner of eligibleOwners) {
      try {
        // Calculate amount to charge (bring balance up to target)
        const amountToPurchase = owner.auto_reload_target_usd - owner.credit_balance_usd;

        if (amountToPurchase <= 0) {
          results.push({
            ownerId: owner.owner_id,
            success: false,
            reason: "Target amount would be negative or zero",
          });
          continue;
        }

        // Check spending limit before charging
        const spendingValidation = await validateAutoReloadSpendingLimit({
          ownerId: owner.owner_id,
          requestedAmountUsd: amountToPurchase,
        });

        if (!spendingValidation.allowed) {
          results.push({
            ownerId: owner.owner_id,
            success: false,
            reason: spendingValidation.reason,
          });
          continue;
        }

        // Use adjusted amount if spending limit requires it
        const finalAmountToPurchase = spendingValidation.adjustedAmountUsd;

        if (finalAmountToPurchase <= 0) {
          results.push({
            ownerId: owner.owner_id,
            success: false,
            reason: "Adjusted amount is zero due to spending limit",
          });
          continue;
        }

        // Charge the customer's saved payment method directly
        const chargeResult = await chargeSavedPaymentMethod({
          customerId: owner.stripe_customer_id,
          amountUsd: finalAmountToPurchase,
          description: `Auto-reload credits to $${owner.auto_reload_target_usd}`,
          metadata: {
            owner_id: owner.owner_id.toString(),
            auto_reload: "true", // Fixed value for auto-reload charges
            trigger_balance: owner.credit_balance_usd.toString(),
            target_balance: owner.auto_reload_target_usd.toString(),
          },
        });

        if (chargeResult.success) {
          results.push({
            ownerId: owner.owner_id,
            success: true,
            amountCharged: finalAmountToPurchase,
            paymentIntentId: chargeResult.paymentIntentId,
          });

          console.log(
            `✅ Auto-reload successful for owner ${owner.owner_id}: $${finalAmountToPurchase}${spendingValidation.isAdjusted ? ` (adjusted from $${amountToPurchase} due to spending limit)` : ""}`
          );
        } else {
          results.push({
            ownerId: owner.owner_id,
            success: false,
            error: chargeResult.error || "Unknown payment error",
          });

          // Send Slack notification for failed auto-reload
          await slackUs(
            `❌ Auto-reload failed!\n` +
              `Owner: ${owner.owner_id}\n` +
              `Attempted amount: $${finalAmountToPurchase}\n` +
              `Error: ${chargeResult.error || "Unknown error"}`
          );

          // Don't log errors for test customers (reduces noise in test output)
          if (!owner.stripe_customer_id?.includes("test"))
            console.error(`❌ Auto-reload failed for owner ${owner.owner_id}:`, chargeResult.error);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        results.push({
          ownerId: owner.owner_id,
          success: false,
          error: errorMessage,
        });

        // Send Slack notification for any other auto-reload errors
        await slackUs(
          `❌ Auto-reload error!\n` + `Owner: ${owner.owner_id}\n` + `Error: ${errorMessage}`
        );

        console.error(`❌ Auto-reload error for owner ${owner.owner_id}:`, error);
      }
    }

    const successCount = results.filter((r) => r.success).length;
    console.log(`Auto-reload completed: ${successCount}/${results.length} successful`);

    return {
      success: true,
      processed: results.length,
      results,
    };
  } catch (error) {
    console.error("Failed to check auto-reloads:", error);
    throw error;
  }
}

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type CreditRow = Database["public"]["Tables"]["credits"]["Row"];

/**
 * Expire credits that have passed their expiration date
 * This should be run daily via cron job
 */
export async function expireCredits() {
  try {
    console.log("Starting credit expiration job...");

    // Find all expired credits that haven't been processed yet
    const { data: expiredCredits, error: selectError } = await supabaseAdmin
      .from("credits")
      .select("*")
      .not("expires_at", "is", null)
      .lt("expires_at", new Date().toISOString())
      .neq("transaction_type", "expiration"); // Don't process already expired credits

    if (selectError) throw new Error(`Failed to fetch expired credits: ${selectError.message}`);

    if (!expiredCredits || expiredCredits.length === 0) {
      console.log("No expired credits found");
      return { expired: 0, owners: [], totalExpired: 0 };
    }

    console.log(`Found ${expiredCredits.length} expired credit transactions`);

    // Group expired credits by owner
    const expiredByOwner = expiredCredits.reduce(
      (acc, credit) => {
        const ownerId = credit.owner_id;
        if (!acc[ownerId]) acc[ownerId] = { totalAmount: 0, credits: [] };

        acc[ownerId].totalAmount += credit.amount_usd;
        acc[ownerId].credits.push(credit);
        return acc;
      },
      {} as Record<number, { totalAmount: number; credits: CreditRow[] }>
    );

    const results = [];

    // Process each owner's expired credits
    for (const [ownerIdStr, { totalAmount, credits }] of Object.entries(expiredByOwner)) {
      const ownerId = parseInt(ownerIdStr);

      try {
        // Create expiration transaction (negative amount to remove from balance)
        const { error: insertError } = await supabaseAdmin.from("credits").insert({
          owner_id: ownerId,
          amount_usd: -totalAmount, // Negative to deduct from balance
          transaction_type: "expiration",
          expires_at: null, // Expiration transactions don't expire
        });

        if (insertError) {
          console.error(
            `Failed to create expiration transaction for owner ${ownerId}:`,
            insertError
          );
          continue;
        }

        // Mark the original credits as processed by updating their transaction type
        const creditIds = credits.map((c) => c.id);
        const { error: updateError } = await supabaseAdmin
          .from("credits")
          .update({ transaction_type: "expiration" })
          .in("id", creditIds);

        if (updateError) {
          console.error(`Failed to mark credits as expired for owner ${ownerId}:`, updateError);
          continue;
        }

        results.push({
          ownerId,
          expiredAmount: totalAmount,
          creditCount: credits.length,
        });

        console.log(`Expired $${totalAmount} in credits for owner ${ownerId}`);
      } catch (error) {
        console.error(`Error processing expiration for owner ${ownerId}:`, error);
      }
    }

    console.log(`Credit expiration job completed. Processed ${results.length} owners.`);

    return {
      expired: results.length,
      owners: results,
      totalExpired: results.reduce((sum, r) => sum + r.expiredAmount, 0),
    };
  } catch (error) {
    console.error("Credit expiration job failed:", error);
    throw error;
  }
}

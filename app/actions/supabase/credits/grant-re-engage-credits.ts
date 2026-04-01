"use server";

import { slackUs } from "@/app/actions/slack/slack-us";
import { insertCredits } from "@/app/actions/supabase/credits/insert-credits";
import { FREE_CREDITS_AMOUNT_USD } from "@/config/pricing";

export const grantReEngageCredits = async (ownerId: number, ownerName: string, balance: number) => {
  const topUp = FREE_CREDITS_AMOUNT_USD - balance;
  if (topUp <= 0) return;
  try {
    await insertCredits({
      owner_id: ownerId,
      amount_usd: topUp,
      transaction_type: "salvage",
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
    console.log(
      `[drip] Granted $${topUp} re-engage credits to owner ${ownerId} (${ownerName}), balance was $${balance}`,
    );
  } catch (e) {
    console.error(`[drip] Failed to grant re-engage credits to owner ${ownerId}:`, e);
    await slackUs(
      `❌ Failed to grant re-engage credits to owner ${ownerId} (${ownerName}): ${e instanceof Error ? e.message : String(e)}`,
    );
  }
};

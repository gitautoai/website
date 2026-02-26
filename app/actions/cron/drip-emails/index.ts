"use server";

import { DAILY_SEND_LIMIT } from "@/config/drip-emails";
import { isBusinessDay } from "@/utils/is-business-day";
import { processBatch } from "./process-batch";
import { slackUs } from "@/app/actions/slack/slack-us";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Main drip email cron job. Processes all active installations in batches.
 * Sends onboarding drip and coverage thresholds.
 */
export const processDripEmails = async () => {
  console.log("[drip] Starting processDripEmails");

  if (!isBusinessDay()) {
    console.log("[drip] Skipping on non-business day");
    return { sent: 0, total: 0, results: [] };
  }

  const startResult = await slackUs("Drip email job started");
  console.log("[drip] Slack start notification sent");
  const threadTs = startResult.threadTs;
  const results: { ownerId: number; emailType: string; success: boolean }[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`[drip] Fetching installations offset=${offset} limit=${DAILY_SEND_LIMIT}`);
    const query = supabaseAdmin
      .from("installations")
      .select("installation_id, owner_id, owner_name, created_at")
      .is("uninstalled_at", null)
      .order("created_at", { ascending: true })
      .range(offset, offset + DAILY_SEND_LIMIT - 1);

    const { data: installations, error: instError } = await query;

    if (instError) throw new Error(`Failed to fetch installations: ${instError.message}`);
    if (!installations || installations.length === 0) {
      console.log(`[drip] No installations at offset=${offset}`);
      break;
    }

    console.log(`[drip] Got ${installations.length} installations, processing batch`);
    hasMore = installations.length === DAILY_SEND_LIMIT;
    offset += installations.length;

    const sentSoFar = results.filter((r) => r.success).length;
    const remaining = DAILY_SEND_LIMIT - sentSoFar;
    const batchResults = await processBatch(installations, remaining);
    results.push(...batchResults);
    console.log(`[drip] Batch done: ${batchResults.length} results`);

    if (results.filter((r) => r.success).length >= DAILY_SEND_LIMIT) {
      console.log(`[drip] Daily send limit (${DAILY_SEND_LIMIT}) reached, stopping`);
      break;
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.length - successCount;
  const summary = `Drip emails: ${successCount} sent, ${failCount} failed`;
  console.log(`[drip] ${summary}`);

  await slackUs(summary, threadTs);

  return { sent: successCount, total: results.length, results };
};

"use server";

import { DAILY_SEND_LIMIT } from "@/config/drip-emails";
import { getOwnerIdsHadSubscription } from "@/app/actions/stripe/get-owner-ids-had-subscription";
import { isBusinessDay } from "@/utils/is-business-day";
import { fetchAllDripData } from "./fetch-batch-data";
import { processOnboarding } from "./process-onboarding";
import { processSalvage } from "./process-salvage";
import { slackUs } from "@/app/actions/slack/slack-us";

/**
 * Main drip email cron job. Processes all active installations,
 * then sends salvage emails to churned users (uninstalled or canceled subscription).
 */
export const processDripEmails = async () => {
  console.log("[drip] Starting processDripEmails");

  if (!isBusinessDay()) {
    console.log("[drip] Skipping on non-business day");
    return { sent: 0, total: 0, results: [] };
  }

  const startResult = await slackUs("Drip email job started");
  const threadTs = startResult.threadTs;

  const { activeInstallations, data, uninstalled } = await fetchAllDripData();

  // Canceled-sub users should get salvage emails, not onboarding
  const canceledSubOwnerIds = await getOwnerIdsHadSubscription(
    activeInstallations.map((i) => i.owner_id),
  );
  const onboardingInstallations = activeInstallations.filter(
    (i) => !canceledSubOwnerIds.has(i.owner_id),
  );

  // Process active installations (excluding canceled-sub users)
  const results = await processOnboarding(onboardingInstallations, data, DAILY_SEND_LIMIT);
  console.log(`[drip] Batch done: ${results.length} results`);

  // Salvage emails for churned users (one-time, shares daily budget)
  const salvageBudget = DAILY_SEND_LIMIT - results.filter((r) => r.success).length;
  if (salvageBudget > 0) {
    const salvageResults = await processSalvage(
      uninstalled,
      activeInstallations,
      data,
      salvageBudget,
    );
    results.push(...salvageResults);
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.length - successCount;
  const summary = `Drip emails: ${successCount} sent, ${failCount} failed`;
  console.log(`[drip] ${summary}`);

  await slackUs(summary, threadTs);

  return { sent: successCount, total: results.length, results };
};

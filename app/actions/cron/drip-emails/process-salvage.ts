"use server";

import { FREE_CREDITS_AMOUNT_USD } from "@/config/pricing";
import { IS_DRY_RUN } from "@/config/drip-emails";
import { generateRandomDelay } from "@/utils/generate-random-delay";
import { generateSalvageUninstallEmail, generateSalvageUninstallSubject } from "./salvage-schedule";
import type { SalvageContext } from "./salvage-schedule";
import type { BatchQueryResults } from "./fetch-batch-data";
import type { getActiveInstallations } from "@/app/actions/supabase/installations/get-active-installations";
import type { getUninstalledInstallations } from "@/app/actions/supabase/installations/get-uninstalled-installations";
import { insertCredits } from "@/app/actions/supabase/credits/insert-credits";
import { getOwnerIdsHadMergedPr } from "@/app/actions/supabase/usage/get-owner-ids-had-merged-pr";
import { getOwnerIdsHadPr } from "@/app/actions/supabase/usage/get-owner-ids-had-pr";
import { getOwnerIdsHadSubscription } from "@/app/actions/stripe/get-owner-ids-had-subscription";
import { getOwnerIdsWithActiveSubscription } from "@/app/actions/stripe/get-owner-ids-with-active-subscription";
import { parseName } from "@/utils/parse-name";
import { sendAndRecord } from "./send-and-record";
import type { SendResult } from "./send-and-record";

interface SalvageTarget {
  owner_id: number;
  owner_name: string;
  uninstalled_at: string | null;
}

/**
 * Send one-time salvage emails to churned users:
 * 1. Users who uninstalled the GitHub App
 * 2. Users who canceled their subscription but are still installed
 * Each user gets exactly one email (tracked via email_sends table).
 * Email content varies based on how far they got before churning.
 */
export const processSalvage = async (
  uninstalled: Awaited<ReturnType<typeof getUninstalledInstallations>>,
  activeInstallations: Awaited<ReturnType<typeof getActiveInstallations>>,
  data: BatchQueryResults,
  budget: number,
) => {
  console.log(`[drip] Starting salvage loop with budget=${budget}`);
  const results: SendResult[] = [];

  // Collect all owner IDs for context lookups
  const allOwnerIds = [
    ...new Set([
      ...uninstalled.map((i) => i.owner_id),
      ...activeInstallations.map((i) => i.owner_id),
    ]),
  ];

  if (allOwnerIds.length === 0) return results;

  // Fetch context flags in parallel
  const [ownerHadPr, ownerHadMergedPr, ownerHasActiveSub, ownerHadSub] = await Promise.all([
    getOwnerIdsHadPr(allOwnerIds),
    getOwnerIdsHadMergedPr(allOwnerIds),
    getOwnerIdsWithActiveSubscription(allOwnerIds),
    getOwnerIdsHadSubscription(allOwnerIds),
  ]);

  // Build targets: uninstalled users + active users with canceled subscriptions
  const targets: SalvageTarget[] = [];
  const seenOwnerIds = new Set<number>();

  for (const inst of uninstalled) {
    if (!inst.uninstalled_at) continue;
    if (seenOwnerIds.has(inst.owner_id)) continue;
    seenOwnerIds.add(inst.owner_id);
    targets.push({
      owner_id: inst.owner_id,
      owner_name: inst.owner_name,
      uninstalled_at: inst.uninstalled_at,
    });
  }

  for (const inst of activeInstallations) {
    if (seenOwnerIds.has(inst.owner_id)) continue;
    if (!ownerHadSub.has(inst.owner_id)) continue;
    seenOwnerIds.add(inst.owner_id);
    targets.push({
      owner_id: inst.owner_id,
      owner_name: inst.owner_name,
      uninstalled_at: null,
    });
  }

  console.log(
    `[drip] Salvage targets: ${targets.length} (${uninstalled.length} uninstalled + canceled-sub active)`,
  );

  if (targets.length === 0) return results;

  const alreadySentIds = new Set(
    Object.entries(data.sentEmails)
      .filter(([, types]) => types.has("salvage_uninstall"))
      .map(([id]) => Number(id)),
  );

  // Build owner → user mapping and credit balance lookup
  const ownerUserMap: Record<number, number> = {};
  const ownerBalance: Record<number, number> = {};
  for (const o of data.owners) {
    ownerBalance[o.owner_id] = o.credit_balance_usd || 0;
    if (!o.created_by) continue;
    const userId = parseInt(o.created_by.split(":")[0], 10);
    if (!isNaN(userId)) ownerUserMap[o.owner_id] = userId;
  }

  const userMap: Record<number, { email: string; displayName: string }> = {};
  for (const u of data.users) {
    if (u.email && !u.user_name.endsWith("[bot]"))
      userMap[u.user_id] = {
        email: u.email,
        displayName: u.display_name_override || u.display_name || u.user_name,
      };
  }

  let salvageSent = 0;
  const emailedUsers = new Set<string>();
  for (const target of targets) {
    if (salvageSent >= budget) break;
    if (alreadySentIds.has(target.owner_id)) continue;
    if (data.repliedOwnerIds.has(target.owner_id)) {
      console.log(
        `[drip] Skipping salvage for owner ${target.owner_id}: recipient replied to a previous email`,
      );
      continue;
    }
    if (ownerHasActiveSub.has(target.owner_id)) {
      console.log(
        `[drip] Skipping salvage for owner ${target.owner_id}: still has active subscription`,
      );
      continue;
    }

    const userId = ownerUserMap[target.owner_id];
    if (!userId) continue;
    const user = userMap[userId];
    if (!user) continue;
    if (emailedUsers.has(user.email)) continue;

    const { firstName } = parseName(user.displayName);
    const ctx: SalvageContext = {
      uninstalledAt: target.uninstalled_at,
      canceledAt: ownerHadSub.get(target.owner_id) || null,
      hadPr: ownerHadPr.has(target.owner_id),
      hadMergedPr: ownerHadMergedPr.has(target.owner_id),
      hadSubscription: ownerHadSub.has(target.owner_id),
      mergedPrCount: ownerHadMergedPr.get(target.owner_id) || 0,
      prCount: ownerHadPr.get(target.owner_id) || 0,
    };

    const subject = generateSalvageUninstallSubject(target.owner_name, ctx);
    const body = generateSalvageUninstallEmail(firstName, ctx);

    const result = await sendAndRecord(
      target.owner_id,
      target.owner_name,
      "salvage_uninstall",
      user.email,
      subject,
      body,
      IS_DRY_RUN ? new Date() : generateRandomDelay(30, 180),
    );
    results.push(result);
    if (result.success) {
      salvageSent++;
      emailedUsers.add(user.email);

      // Top up credits so they can actually try GitAuto again
      const balance = ownerBalance[target.owner_id] || 0;
      const topUp = FREE_CREDITS_AMOUNT_USD - balance;
      if (topUp > 0) {
        try {
          await insertCredits({
            owner_id: target.owner_id,
            amount_usd: topUp,
            transaction_type: "salvage",
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          });
          console.log(
            `[drip] Granted $${topUp} salvage credits to owner ${target.owner_id} (${target.owner_name}), balance was $${balance}`,
          );
        } catch (e) {
          console.error(`[drip] Failed to grant salvage credits to owner ${target.owner_id}:`, e);
        }
      }
    }
  }
  console.log(`[drip] Salvage loop done: ${salvageSent} sent`);

  return results;
};

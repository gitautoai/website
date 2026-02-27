"use server";

import { buildOwnerContext } from "./build-owner-context";
import { DRY_RUN_TO, EMAIL_GAP_DAYS, FIRST_EMAIL_DAY } from "@/config/drip-emails";
import type { BatchQueryResults } from "./fetch-batch-data";
import { isPrOpen } from "@/app/actions/github/is-pr-open";
import { generateRandomDelay } from "@/utils/generate-random-delay";
import { insertEmailSend } from "@/app/actions/supabase/email-sends/insert-email-send";
import { coverageThresholds } from "./owner-coverage-schedule";
import { onboardingSchedule } from "./onboarding-schedule";
import { sendAndRecord } from "./send-and-record";
import type { SendResult } from "./send-and-record";

export const processOnboarding = async (
  installations: {
    installation_id: number;
    owner_id: number;
    owner_name: string;
    created_at: string;
  }[],
  data: BatchQueryResults,
  sendBudget: number,
) => {
  const lookups = buildOwnerContext(data);

  const results: SendResult[] = [];
  const now = Date.now();
  // One user can own multiple orgs. Limit to one email per user per cron run
  // so they don't get bombarded. Oldest installation is processed first.
  const emailedUsers = new Set<string>();

  let sendCount = 0;
  for (const inst of installations) {
    if (sendCount >= sendBudget) {
      console.log(`[drip] Send budget (${sendBudget}) exhausted, stopping batch`);
      break;
    }
    const ownerId = inst.owner_id;
    const userInfo = lookups.getUserInfo(ownerId);
    if (!userInfo) {
      console.log(`Skipping owner ${ownerId}: no user or email`);
      continue;
    }
    if (emailedUsers.has(userInfo.email)) {
      console.log(`Skipping owner ${ownerId}: already emailed ${userInfo.email} this run`);
      continue;
    }

    const daysSinceInstall = Math.floor(
      (now - new Date(inst.created_at).getTime()) / (1000 * 60 * 60 * 24),
    );
    const alreadySent = lookups.getSentEmails(ownerId);
    const ctx = lookups.buildContext(ownerId, inst.created_at);

    // Filter setup PRs to only include ones still open on GitHub
    if (ctx.setupPrs.length > 0) {
      const openChecks = await Promise.all(
        ctx.setupPrs.map((pr) =>
          isPrOpen(inst.installation_id, inst.owner_name, pr.repoName, pr.prNumber),
        ),
      );
      ctx.setupPrs = ctx.setupPrs.filter((_, i) => openChecks[i]);
    }

    // Max one email per owner per run (cron runs daily)
    let sentThisRun = false;

    // Onboarding drip emails (slot-based: skipped emails don't take a slot)
    let slot = 0;
    for (const schedule of onboardingSchedule) {
      if (sentThisRun) break;
      if (schedule.shouldPause(ctx)) {
        console.log(`Paused drip at ${schedule.emailType} for owner ${ownerId}`);
        break;
      }
      if (schedule.shouldSkip(ctx)) {
        console.log(`Skipped ${schedule.emailType} for owner ${ownerId}`);
        continue;
      }

      const emailDay = FIRST_EMAIL_DAY + slot * EMAIL_GAP_DAYS;

      if (alreadySent.has(schedule.emailType)) {
        slot++;
        continue;
      }

      if (daysSinceInstall < emailDay) break;

      const emailTo = DRY_RUN_TO || userInfo.email;
      const emailSubject = DRY_RUN_TO
        ? `[TEST ${inst.owner_name} → ${userInfo.email}] ${schedule.subject(inst.owner_name, userInfo.firstName, ctx)}`
        : schedule.subject(inst.owner_name, userInfo.firstName, ctx);
      const result = await sendAndRecord(
        ownerId,
        inst.owner_name,
        schedule.emailType,
        emailTo,
        emailSubject,
        schedule.body(inst.owner_name, userInfo.firstName, ctx),
        DRY_RUN_TO ? generateRandomDelay(1, 3) : generateRandomDelay(30, 180),
      );
      results.push(result);
      if (result.success) {
        alreadySent.add(schedule.emailType);
        sentThisRun = true;
        sendCount++;
        emailedUsers.add(userInfo.email);
      }
      slot++;
    }

    // Owner-level coverage threshold: send the highest applicable, unsent, non-paused threshold.
    // e.g. coverage 83%, 80% paused (no purchase yet) → fall through to 50% if eligible.
    if (!sentThisRun && ctx.ownerCoveragePct !== null) {
      let highestCovThreshold = null;
      for (const t of [...coverageThresholds].reverse()) {
        if (ctx.ownerCoveragePct < t.pct) continue;
        if (alreadySent.has(t.emailType)) continue;
        if (t.shouldSkip(ctx)) {
          console.log(`Skipped ${t.emailType} for owner ${ownerId}`);
          continue;
        }
        if (t.shouldPause(ctx)) {
          console.log(`Paused ${t.emailType} for owner ${ownerId}`);
          continue;
        }
        highestCovThreshold = t;
        break;
      }
      if (highestCovThreshold) {
        const covTo = DRY_RUN_TO || userInfo.email;
        const covSubject = DRY_RUN_TO
          ? `[TEST ${inst.owner_name} → ${userInfo.email}] ${highestCovThreshold.subject(inst.owner_name, ctx.ownerCoveragePct!, ctx.coverageRepoCount, ctx.repoMostNeedingCoverage)}`
          : highestCovThreshold.subject(
              inst.owner_name,
              ctx.ownerCoveragePct!,
              ctx.coverageRepoCount,
              ctx.repoMostNeedingCoverage,
            );
        const result = await sendAndRecord(
          ownerId,
          inst.owner_name,
          highestCovThreshold.emailType,
          covTo,
          covSubject,
          highestCovThreshold.body(
            inst.owner_name,
            userInfo.firstName,
            ctx.ownerCoveragePct!,
            ctx.coverageRepoCount,
            ctx.repoMostNeedingCoverage,
          ),
          DRY_RUN_TO ? generateRandomDelay(1, 3) : generateRandomDelay(30, 180),
        );
        results.push(result);
        if (result.success) {
          alreadySent.add(highestCovThreshold.emailType);
          sentThisRun = true;
          sendCount++;
          emailedUsers.add(userInfo.email);
          // Mark all lower thresholds as sent so we don't send "congrats on 50%" after celebrating 80%
          for (const lower of coverageThresholds) {
            if (lower.pct >= highestCovThreshold.pct) continue;
            if (alreadySent.has(lower.emailType)) continue;
            alreadySent.add(lower.emailType);
            await insertEmailSend({
              ownerId,
              ownerName: inst.owner_name,
              emailType: lower.emailType,
            });
          }
        }
      }
    }
  }

  return results;
};

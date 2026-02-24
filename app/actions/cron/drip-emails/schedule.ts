import { CREDIT_PRICING } from "@/config/pricing";
import {
  generateCoverageChartsEmail,
  generateCoverageChartsSubject,
} from "@/app/actions/resend/templates/drip/onboarding/02-coverage-charts";
import {
  generateMergeTestPrEmail,
  generateMergeTestPrSubject,
} from "@/app/actions/resend/templates/drip/onboarding/04-merge-test-pr";
import {
  generatePurchaseCreditsEmail,
  generatePurchaseCreditsSubject,
} from "@/app/actions/resend/templates/drip/onboarding/05-purchase-credits";
import {
  generateReviewSetupPrEmail,
  generateReviewSetupPrSubject,
} from "@/app/actions/resend/templates/drip/onboarding/01-review-setup-pr";
import {
  generateSetTargetBranchEmail,
  generateSetTargetBranchSubject,
} from "@/app/actions/resend/templates/drip/onboarding/03-set-target-branch";
import type { DripScheduleItem } from "@/types/drip-emails";

// Order follows the natural user journey:
// Setup → See baseline → Configure branch & automate → First PR tips → Buy credits
// Timing is slot-based: skipped emails don't take a slot, so the next email moves up.
export const DRIP_SCHEDULE: DripScheduleItem[] = [
  {
    emailType: "onboarding_review_setup_pr",
    subject: (ownerName, _firstName, ctx) => generateReviewSetupPrSubject(ownerName, ctx),
    body: (ownerName, firstName, ctx) => generateReviewSetupPrEmail(ownerName, firstName, ctx),
    shouldSkip: (ctx) => ctx.hasSetupPrMerged || ctx.hasOwnerCoverage,
    shouldPause: () => false,
  },
  {
    emailType: "onboarding_coverage_charts",
    subject: (_ownerName, _firstName, ctx) => generateCoverageChartsSubject(ctx),
    body: (ownerName, firstName, ctx) => generateCoverageChartsEmail(ownerName, firstName, ctx),
    shouldSkip: () => false,
    shouldPause: (ctx) => !ctx.hasOwnerCoverage,
  },
  {
    emailType: "onboarding_set_target_branch",
    subject: () => generateSetTargetBranchSubject(),
    body: (ownerName, firstName, ctx) => generateSetTargetBranchEmail(ownerName, firstName, ctx),
    shouldSkip: (ctx) => ctx.scheduledRepoCount > 0,
    // Wait until they have coverage data before nudging about scheduling
    shouldPause: (ctx) => !ctx.hasOwnerCoverage,
  },
  {
    emailType: "onboarding_merge_test_pr",
    subject: (_ownerName, _firstName, ctx) => generateMergeTestPrSubject(ctx),
    body: (_ownerName, firstName, ctx) => generateMergeTestPrEmail(firstName, ctx),
    shouldSkip: (ctx) => ctx.hasMergedPr,
    shouldPause: (ctx) => !ctx.hasPrs,
  },
  {
    emailType: "onboarding_purchase_credits",
    subject: (_ownerName, _firstName, ctx) => generatePurchaseCreditsSubject(ctx),
    body: (_ownerName, firstName, ctx) => generatePurchaseCreditsEmail(firstName, ctx),
    shouldSkip: () => false,
    shouldPause: (ctx) =>
      !ctx.hasPrs ||
      ctx.hasActiveSubscription ||
      ctx.hasAutoReloadEnabled ||
      (ctx.hasPurchasedCredits && (ctx.creditBalanceUsd ?? 0) > CREDIT_PRICING.PER_PR.AMOUNT_USD),
  },
];

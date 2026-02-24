import { CREDIT_PRICING } from "@/config/pricing";
import { EMAIL_SIGN_OFF } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";
import type { OwnerContext } from "@/types/drip-emails";

/**
 * Never purchased, has free credits left:
 *   Subject: Keep the test coverage growing
 *   Body:
 *     Hi Alice - you have $14 in free credits. Each PR costs $7. Set up auto-reload so you never run out.
 *
 *     https://gitauto.ai/dashboard/credits
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Never purchased, zero balance:
 *   Subject: You're out of credits
 *   Body:
 *     Hi Alice - you're out of credits. Each PR costs $7. Buy credits and set up auto-reload to keep going.
 *
 *     https://gitauto.ai/dashboard/credits
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Purchased but balance low (≤ $7):
 *   Subject: You're running low on credits
 *   Body:
 *     Hi Alice - you have $5 in credits - not enough for another PR. Set up auto-reload so this doesn't happen again.
 *
 *     https://gitauto.ai/dashboard/credits
 *
 *     Wes
 *     Founder, GitAuto
 */
export const generatePurchaseCreditsSubject = (ctx: OwnerContext) => {
  if (ctx.hasPurchasedCredits) return "You're running low on credits";
  if (ctx.creditBalanceUsd !== null && ctx.creditBalanceUsd <= 0) return "You're out of credits";
  return "Keep the test coverage growing";
};

export const generatePurchaseCreditsEmail = (firstName: string, ctx: OwnerContext) => {
  const prCost = CREDIT_PRICING.PER_PR.AMOUNT_USD;
  let balanceLine: string;
  let cta: string;

  if (ctx.hasPurchasedCredits) {
    balanceLine = `you have $${ctx.creditBalanceUsd ?? 0} in credits - not enough for another PR.`;
    cta = "Set up auto-reload so this doesn't happen again.";
  } else if (ctx.creditBalanceUsd !== null && ctx.creditBalanceUsd <= 0) {
    balanceLine = `you're out of credits. Each PR costs $${prCost}.`;
    cta = "Buy credits and set up auto-reload to keep going.";
  } else {
    balanceLine = `you have $${ctx.creditBalanceUsd ?? 0} in free credits. Each PR costs $${prCost}.`;
    cta = "Set up auto-reload so you never run out.";
  }

  return `Hi ${firstName} - ${balanceLine} ${cta}

${ABSOLUTE_URLS.GITAUTO.DASHBOARD.CREDITS}

${EMAIL_SIGN_OFF}`;
};

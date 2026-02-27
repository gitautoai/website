import {
  generateSalvageHadSubscriptionEmail,
  generateSalvageHadSubscriptionSubject,
} from "@/app/actions/resend/templates/drip/re-engage/01-salvage-had-subscription";
import {
  generateSalvageMergedPrEmail,
  generateSalvageMergedPrSubject,
} from "@/app/actions/resend/templates/drip/re-engage/02-salvage-merged-pr";
import {
  generateSalvageHadPrEmail,
  generateSalvageHadPrSubject,
} from "@/app/actions/resend/templates/drip/re-engage/03-salvage-had-pr";
import {
  generateSalvageNoEngagementEmail,
  generateSalvageNoEngagementSubject,
} from "@/app/actions/resend/templates/drip/re-engage/04-salvage-no-engagement";

export interface SalvageContext {
  uninstalledAt: string | null;
  canceledAt: string | null;
  hadMergedPr: boolean;
  hadPr: boolean;
  hadSubscription: boolean;
  mergedPrCount: number;
  prCount: number;
}

export const generateSalvageUninstallSubject = (ownerName: string, ctx: SalvageContext) => {
  if (ctx.hadSubscription) return generateSalvageHadSubscriptionSubject(ownerName);
  if (ctx.hadMergedPr) return generateSalvageMergedPrSubject(ownerName);
  if (ctx.hadPr) return generateSalvageHadPrSubject(ownerName, ctx);
  return generateSalvageNoEngagementSubject(ownerName);
};

export const generateSalvageUninstallEmail = (firstName: string, ctx: SalvageContext) => {
  if (ctx.hadSubscription) return generateSalvageHadSubscriptionEmail(firstName, ctx);
  if (ctx.hadMergedPr) return generateSalvageMergedPrEmail(firstName, ctx);
  if (ctx.hadPr) return generateSalvageHadPrEmail(firstName, ctx);
  return generateSalvageNoEngagementEmail(firstName, ctx);
};

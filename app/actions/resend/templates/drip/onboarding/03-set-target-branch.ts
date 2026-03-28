import { EMAIL_SIGN_OFF } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";
import type { OwnerContext } from "@/types/drip-emails";

/**
 * Subject: Set a target branch and enable a schedule
 * Body:
 *   Hi Alice - acme/backend has the most uncovered code (15%) - start there. Set a target branch and enable a schedule:
 *
 *   https://gitauto.ai/dashboard/rules
 *   https://gitauto.ai/dashboard/triggers
 *
 *   Wes
 *   Founder, GitAuto
 */
export const generateSetTargetBranchSubject = () => "Set a target branch and enable a schedule";

export const generateSetTargetBranchEmail = (
  ownerName: string,
  firstName: string,
  ctx: OwnerContext,
) => {
  const pct =
    ctx.repoMostNeedingCoveragePct !== null ? ` (${ctx.repoMostNeedingCoveragePct}%)` : "";

  return `Hi ${firstName} - ${ownerName}/${ctx.repoMostNeedingCoverage} has the most uncovered code${pct} - start there. Set a target branch and enable a schedule:

${ABSOLUTE_URLS.GITAUTO.DASHBOARD.RULES}
${ABSOLUTE_URLS.GITAUTO.DASHBOARD.TRIGGERS}

${EMAIL_SIGN_OFF}`;
};

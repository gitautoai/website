import { ABSOLUTE_URLS } from "@/config/urls";
import { EMAIL_SIGN_OFF } from "@/config";
import { EMAIL_VALUE_PROP } from "@/config/drip-emails";
import { formatRelativeTime } from "@/utils/format-relative-time";
import type { SalvageContext } from "@/app/actions/cron/drip-emails/salvage-schedule";

/**
 * Had subscription (now canceled), may or may not have uninstalled:
 *   Subject: acme - a lot has changed with GitAuto
 *   Body (uninstalled):
 *     Hi Alice - a lot has changed with GitAuto since you uninstalled back in Jan 2025.
 *   Body (still installed):
 *     Hi Alice - a lot has changed with GitAuto since you canceled your subscription back in Oct 2025.
 *
 *     Now, GitAuto opens unit test PRs to help you hit 90% coverage. It's fire-and-forget, not a tool you sit and prompt. PRs just show up - you review and merge. Here's a quick look: https://www.youtube.com/watch?v=jmTQuuJAs38
 *
 *     https://github.com/apps/gitauto-ai/installations/new (only if uninstalled)
 *
 *     Wes
 *     Founder, GitAuto
 */
export const generateSalvageHadSubscriptionSubject = (ownerName: string) =>
  `${ownerName} - a lot has changed with GitAuto`;

export const generateSalvageHadSubscriptionEmail = (firstName: string, ctx: SalvageContext) => {
  const when = ctx.uninstalledAt
    ? `you uninstalled ${formatRelativeTime(ctx.uninstalledAt)}`
    : ctx.canceledAt
      ? `you canceled your subscription ${formatRelativeTime(ctx.canceledAt)}`
      : "you canceled your subscription";
  const opener = `Hi ${firstName} - a lot has changed with GitAuto since ${when}.`;

  const reinstall = ctx.uninstalledAt
    ? `\nGive it another try: ${ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}\n`
    : "";

  return `${opener}

Now, ${EMAIL_VALUE_PROP}
${reinstall}
${EMAIL_SIGN_OFF}`;
};

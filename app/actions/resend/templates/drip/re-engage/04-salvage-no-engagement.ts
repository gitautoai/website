import { ABSOLUTE_URLS } from "@/config/urls";
import { EMAIL_SIGN_OFF } from "@/config";
import { EMAIL_VALUE_PROP } from "@/config/drip-emails";
import { formatRelativeTime } from "@/utils/format-relative-time";
import type { SalvageContext } from "@/app/actions/cron/drip-emails/salvage-schedule";

/**
 * Uninstalled back in Jan 2025:
 *   Subject: acme - quick look at what GitAuto does
 *   Body:
 *     Hi Alice - since you uninstalled GitAuto back in Jan 2025, it got a lot better.
 *
 *     In short, GitAuto opens unit test PRs to help you hit 90% coverage. It's fire-and-forget, not a tool you sit and prompt. PRs just show up - you review and merge. Here's a quick look: https://www.youtube.com/watch?v=jmTQuuJAs38
 *
 *     https://github.com/apps/gitauto-ai/installations/new (only if uninstalled)
 *
 *     Wes
 *     Founder, GitAuto
 */
export const generateSalvageNoEngagementSubject = (ownerName: string) =>
  `${ownerName} - quick look at what GitAuto does`;

export const generateSalvageNoEngagementEmail = (firstName: string, ctx: SalvageContext) => {
  const opener = ctx.uninstalledAt
    ? `Hi ${firstName} - since you uninstalled GitAuto ${formatRelativeTime(ctx.uninstalledAt)}, it got a lot better.`
    : `Hi ${firstName} - GitAuto got a lot better since you last used it.`;

  const reinstall = ctx.uninstalledAt
    ? `\nGive it another try: ${ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}\n`
    : "";

  return `${opener}

In short, ${EMAIL_VALUE_PROP}
${reinstall}
${EMAIL_SIGN_OFF}`;
};

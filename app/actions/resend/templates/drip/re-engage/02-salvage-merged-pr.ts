import { ABSOLUTE_URLS } from "@/config/urls";
import { EMAIL_SIGN_OFF } from "@/config";
import { EMAIL_VALUE_PROP } from "@/config/drip-emails";
import { formatRelativeTime } from "@/utils/format-relative-time";
import type { SalvageContext } from "@/app/actions/cron/drip-emails/salvage-schedule";

/**
 * Had merged PRs, may or may not have uninstalled:
 *   Subject: acme's coverage could keep growing
 *   Body (uninstalled, 3 PRs):
 *     Hi Alice - you merged 3 GitAuto PRs before you uninstalled back in Jan 2025. A lot has improved since then.
 *   Body (still installed, 1 PR):
 *     Hi Alice - you merged a GitAuto PR a while back. A lot has improved since then.
 *
 *     Today, GitAuto opens unit test PRs to help you hit 90% coverage. It's fire-and-forget, not a tool you sit and prompt. PRs just show up - you review and merge. Here's a quick look: https://www.youtube.com/watch?v=jmTQuuJAs38
 *
 *     Give it another try: https://github.com/apps/gitauto-ai/installations/new (only if uninstalled)
 *
 *     Wes
 *     Founder, GitAuto
 */
export const generateSalvageMergedPrSubject = (ownerName: string) =>
  `${ownerName}'s coverage could keep growing`;

export const generateSalvageMergedPrEmail = (firstName: string, ctx: SalvageContext) => {
  const n = ctx.mergedPrCount;
  const prs = n === 1 ? "a GitAuto PR" : `${n} GitAuto PRs`;
  const opener = ctx.uninstalledAt
    ? `Hi ${firstName} - you merged ${prs} before you uninstalled ${formatRelativeTime(ctx.uninstalledAt)}. A lot has improved since then.`
    : `Hi ${firstName} - you merged ${prs} a while back. A lot has improved since then.`;

  const reinstall = ctx.uninstalledAt
    ? `\nGive it another try: ${ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}\n`
    : "";

  return `${opener}

Today, ${EMAIL_VALUE_PROP}
${reinstall}
${EMAIL_SIGN_OFF}`;
};

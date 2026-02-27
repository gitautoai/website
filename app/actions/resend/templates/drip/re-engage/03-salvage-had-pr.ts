import { ABSOLUTE_URLS } from "@/config/urls";
import { EMAIL_SIGN_OFF } from "@/config";
import { EMAIL_VALUE_PROP } from "@/config/drip-emails";
import { formatRelativeTime } from "@/utils/format-relative-time";
import type { SalvageContext } from "@/app/actions/cron/drip-emails/salvage-schedule";

/**
 * Had PRs (not merged), may or may not have uninstalled:
 *   Subject: acme - GitAuto opened 5 PRs, and they've gotten way better
 *   Body (uninstalled, 5 PRs):
 *     Hi Alice - GitAuto opened 5 PRs for you before you uninstalled back in Jan 2025. They've gotten a lot better since then.
 *   Body (still installed, 1 PR):
 *     Hi Alice - GitAuto opened a PR for you a while back. PRs have gotten a lot better since then.
 *
 *     These days, GitAuto opens unit test PRs to help you hit 90% coverage. It's fire-and-forget, not a tool you sit and prompt. PRs just show up - you review and merge. Here's a quick look: https://www.youtube.com/watch?v=jmTQuuJAs38
 *
 *     Give it another try: https://github.com/apps/gitauto-ai/installations/new (only if uninstalled)
 *
 *     Wes
 *     Founder, GitAuto
 */
export const generateSalvageHadPrSubject = (ownerName: string, ctx: SalvageContext) => {
  const n = ctx.prCount;
  const prs = n === 1 ? "a PR" : `${n} PRs`;
  return `${ownerName} - GitAuto opened ${prs}, and they've gotten way better`;
};

export const generateSalvageHadPrEmail = (firstName: string, ctx: SalvageContext) => {
  const n = ctx.prCount;
  const prs = n === 1 ? "a PR" : `${n} PRs`;
  const opener = ctx.uninstalledAt
    ? `Hi ${firstName} - GitAuto opened ${prs} for you before you uninstalled ${formatRelativeTime(ctx.uninstalledAt)}. They've gotten a lot better since then.`
    : `Hi ${firstName} - GitAuto opened ${prs} for you a while back. PRs have gotten a lot better since then.`;

  const reinstall = ctx.uninstalledAt
    ? `\nGive it another try: ${ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}\n`
    : "";

  return `${opener}

These days, ${EMAIL_VALUE_PROP}
${reinstall}
${EMAIL_SIGN_OFF}`;
};

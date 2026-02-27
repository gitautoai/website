import { EMAIL_SIGN_OFF } from "@/config";
import { EMAIL_VALUE_PROP } from "@/config/drip-emails";
import { formatRelativeTime } from "@/utils/format-relative-time";
import type { OwnerContext } from "@/types/drip-emails";

/**
 * Installed back in Jan 2025 (different year):
 *   Subject: Still interested in test coverage for acme?
 *   Body:
 *     Hi Alice - you installed GitAuto for acme back in Jan 2025. Remember? Sorry I didn't follow up sooner.
 *
 *     Since then, GitAuto opens unit test PRs to help you hit 90% coverage. It's fire-and-forget, not a tool you sit and prompt. PRs just show up - you review and merge. Here's a quick look: https://www.youtube.com/watch?v=jmTQuuJAs38
 *
 *     I'll walk you through getting set up over the next few emails.
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Installed back in Jan (same year):
 *   Subject: Still interested in test coverage for acme?
 *   Body:
 *     Hi Alice - you installed GitAuto for acme back in Jan. Remember? Sorry I didn't follow up sooner.
 *
 *     Since then, GitAuto opens unit test PRs to help you hit 90% coverage. It's fire-and-forget, not a tool you sit and prompt. PRs just show up - you review and merge. Here's a quick look: https://www.youtube.com/watch?v=jmTQuuJAs38
 *
 *     I'll walk you through getting set up over the next few emails.
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Installed a few weeks ago (same month):
 *   Subject: Still interested in test coverage for acme?
 *   Body:
 *     Hi Alice - you installed GitAuto for acme a few weeks ago. Remember? Sorry I didn't follow up sooner.
 *
 *     Since then, GitAuto opens unit test PRs to help you hit 90% coverage. It's fire-and-forget, not a tool you sit and prompt. PRs just show up - you review and merge. Here's a quick look: https://www.youtube.com/watch?v=jmTQuuJAs38
 *
 *     I'll walk you through getting set up over the next few emails.
 *
 *     Wes
 *     Founder, GitAuto
 */
export const generateDormantReintroSubject = (ownerName: string) =>
  `Still interested in test coverage for ${ownerName}?`;

export const generateDormantReintroEmail = (
  ownerName: string,
  firstName: string,
  ctx: OwnerContext,
) => {
  const when = formatRelativeTime(ctx.installedAt);

  return `Hi ${firstName} - you installed GitAuto for ${ownerName} ${when}. Remember? Sorry I didn't follow up sooner.

Since then, ${EMAIL_VALUE_PROP}

I'll walk you through getting set up over the next few emails.

${EMAIL_SIGN_OFF}`;
};

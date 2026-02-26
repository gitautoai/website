import { ABSOLUTE_URLS } from "@/config/urls";
import { EMAIL_SIGN_OFF } from "@/config";
import { formatPrUrl } from "@/utils/format-pr-url";
import type { OwnerContext } from "@/types/drip-emails";

/**
 * Single PR:
 *   Subject: Review acme/backend PR 42
 *   Body:
 *     Hi Alice - your acme setup PR is waiting. Merge to start tracking coverage.
 *
 *     https://github.com/acme/backend/pull/42
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Multiple PRs:
 *   Subject: 2 setup PRs waiting in acme
 *   Body:
 *     Hi Alice - your acme setup PRs are waiting. Merge to start tracking coverage.
 *
 *     https://github.com/acme/backend/pull/42
 *     https://github.com/acme/frontend/pull/7
 *
 *     Wes
 *     Founder, GitAuto
 *
 * No setup PRs:
 *   Subject: Set up test coverage for acme
 *   Body:
 *     Hi Alice - GitAuto can create a setup PR for acme to start tracking coverage.
 *     Follow the steps here:
 *
 *     https://gitauto.ai/docs/getting-started/setup
 *
 *     Wes
 *     Founder, GitAuto
 */
export const generateReviewSetupPrSubject = (ownerName: string, ctx: OwnerContext) => {
  if (ctx.setupPrs.length === 0) return `Set up test coverage for ${ownerName}`;
  if (ctx.setupPrs.length === 1)
    return `Review ${ownerName}/${ctx.setupPrs[0].repoName} PR ${ctx.setupPrs[0].prNumber}`;
  return `${ctx.setupPrs.length} setup PRs waiting in ${ownerName}`;
};

export const generateReviewSetupPrEmail = (
  ownerName: string,
  firstName: string,
  ctx: OwnerContext,
) => {
  if (ctx.setupPrs.length === 0)
    return `Hi ${firstName} - GitAuto can create a setup PR for ${ownerName} to start tracking coverage. Follow the steps here:

${ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.SETUP}

${EMAIL_SIGN_OFF}`;

  const prUrls = ctx.setupPrs.map((pr) => formatPrUrl(ownerName, pr.repoName, pr.prNumber));
  const prList = prUrls.join("\n");

  return `Hi ${firstName} - your ${ownerName} setup ${ctx.setupPrs.length === 1 ? "PR is" : "PRs are"} waiting. Merge to track coverage.

${prList}

${EMAIL_SIGN_OFF}`;
};

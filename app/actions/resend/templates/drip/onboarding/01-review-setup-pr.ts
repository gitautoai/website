import { ABSOLUTE_URLS } from "@/config/urls";
import { EMAIL_SIGN_OFF } from "@/config";
import type { OwnerContext } from "@/types/drip-emails";

const formatPrUrl = (ownerName: string, pr: { repoName: string; prNumber: number }) =>
  `https://github.com/${ownerName}/${pr.repoName}/pull/${pr.prNumber}`;

/**
 * Single PR:
 *   Subject: Review acme/backend PR 42
 *   Body:
 *     Hi Alice - your setup PR is waiting. Merge to start tracking coverage.
 *
 *     https://github.com/acme/backend/pull/42
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Multiple PRs:
 *   Subject: 2 setup PRs waiting in acme
 *   Body:
 *     Hi Alice - your setup PRs are waiting. Merge to start tracking coverage.
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
 *     Hi Alice - GitAuto can create a setup PR to start tracking coverage.
 *     Follow the steps here to trigger it:
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
    return `Hi ${firstName} - GitAuto can create a setup PR to start tracking coverage. Follow the steps here to trigger it:

${ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.SETUP}

${EMAIL_SIGN_OFF}`;

  const prUrls = ctx.setupPrs.map((pr) => formatPrUrl(ownerName, pr));
  const prList = prUrls.join("\n");

  return `Hi ${firstName} - your setup ${ctx.setupPrs.length === 1 ? "PR" : "PRs"} ${ctx.setupPrs.length === 1 ? "is" : "are"} waiting. Merge to start tracking coverage.

${prList}

${EMAIL_SIGN_OFF}`;
};

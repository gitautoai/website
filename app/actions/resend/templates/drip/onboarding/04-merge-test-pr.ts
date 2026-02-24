import { EMAIL_SIGN_OFF, PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";
import type { OwnerContext } from "@/types/drip-emails";

const MAX_PR_LINKS = 3;

const formatPrUrl = (pr: { ownerName: string; repoName: string; prNumber: number }) =>
  `https://github.com/${pr.ownerName}/${pr.repoName}/pull/${pr.prNumber}`;

/**
 * Subject: You have 3 PRs adding unit tests - merge if CI passes
 * Body:
 *   Hi Alice - you have 3 PRs adding unit tests. If CI passes, merge it. If something looks off, leave a review comment and GitAuto will revise.
 *
 *   https://github.com/acme/backend/pull/12
 *   https://github.com/acme/frontend/pull/34
 *   https://github.com/acme/api/pull/56
 *
 *   Wes
 *   Founder, GitAuto
 *
 * More than 3 open PRs, all in one repo:
 *   ...
 *   and 2 more: https://github.com/acme/backend/pulls/app%2Fgitauto-ai
 *
 * More than 3 open PRs, across multiple repos:
 *   ...
 *   and 2 more: https://gitauto.ai/dashboard/prs
 *
 * Note: shouldPause guarantees prCount > 0 when this email fires.
 */
export const generateMergeTestPrSubject = (ctx: OwnerContext) =>
  `You have ${ctx.prCount} ${ctx.prCount === 1 ? "PR" : "PRs"} adding unit tests - merge if CI passes`;

export const generateMergeTestPrEmail = (firstName: string, ctx: OwnerContext) => {
  const shown = ctx.openTestPrs.slice(0, MAX_PR_LINKS);
  const rest = ctx.openTestPrs.slice(MAX_PR_LINKS);
  const prLinks = shown.map(formatPrUrl).join("\n");

  let moreLine = "";
  if (rest.length > 0) {
    const restRepos = new Set(rest.map((pr) => `${pr.ownerName}/${pr.repoName}`));
    // If all remaining PRs are in one repo, link to GitHub's filtered PR list for that repo.
    // Otherwise fall back to the GitAuto dashboard which shows all repos.
    const moreUrl =
      restRepos.size === 1
        ? `https://github.com/${[...restRepos][0]}/pulls/app%2Fgitauto-ai`
        : ABSOLUTE_URLS.GITAUTO.DASHBOARD.PRS;
    moreLine = `\nand ${rest.length} more: ${moreUrl}`;
  }

  return `Hi ${firstName} - you have ${ctx.prCount} ${ctx.prCount === 1 ? "PR" : "PRs"} adding unit tests. If CI passes, merge it. If something looks off, leave a review comment and ${PRODUCT_NAME} will revise.

${prLinks}${moreLine}

${EMAIL_SIGN_OFF}`;
};

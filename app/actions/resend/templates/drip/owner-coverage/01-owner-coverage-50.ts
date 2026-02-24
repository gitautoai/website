import { EMAIL_SIGN_OFF } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * Single repo example:
 *   Subject: acme/backend's test coverage just hit 50%
 *   Body:
 *     Hi Alice - congrats on the milestone! See the coverage chart:
 *
 *     https://gitauto.ai/dashboard/charts
 *
 *     How's GitAuto working for you so far? Reply to this email - I read every one.
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Multi repo example:
 *   Subject: acme's test coverage just hit 50%
 *   Body:
 *     Hi Alice - congrats on the milestone! This is weighted coverage across 3 repos. See the chart:
 *
 *     https://gitauto.ai/dashboard/charts
 *
 *     How's GitAuto working for you so far? Reply to this email - I read every one.
 *
 *     Wes
 *     Founder, GitAuto
 */
const subjectLabel = (ownerName: string, repoCount: number, repoName: string | null) =>
  repoCount === 1 && repoName ? `${ownerName}/${repoName}` : ownerName;

export const generateOwnerCoverage50Subject = (
  ownerName: string,
  pct: number,
  repoCount: number,
  repoName: string | null,
) => `${subjectLabel(ownerName, repoCount, repoName)}'s test coverage just hit ${Math.round(pct)}%`;

export const generateOwnerCoverage50Email = (
  _ownerName: string,
  firstName: string,
  _pct: number,
  repoCount: number,
  _repoName: string | null,
) => {
  const weightedNote = repoCount > 1 ? ` This is weighted coverage across ${repoCount} repos.` : "";

  return `Hi ${firstName} - congrats on the milestone!${weightedNote} See the coverage chart:

${ABSOLUTE_URLS.GITAUTO.DASHBOARD.CHARTS}

How's GitAuto working for you so far? Reply to this email - I read every one.

${EMAIL_SIGN_OFF}`;
};

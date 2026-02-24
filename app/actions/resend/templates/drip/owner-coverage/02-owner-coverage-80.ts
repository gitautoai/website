import { EMAIL_SIGN_OFF } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * Single repo example:
 *   Subject: acme/backend's coverage is 82% - nice work
 *   Body:
 *     Hi Alice - you're in great shape. See the coverage chart:
 *
 *     https://gitauto.ai/dashboard/charts
 *
 *     Mind sharing a testimonial? Just reply to this email.
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Multi repo example:
 *   Subject: acme's coverage is 82% - nice work
 *   Body:
 *     Hi Alice - you're in great shape. This is weighted coverage across 3 repos. See the chart:
 *
 *     https://gitauto.ai/dashboard/charts
 *
 *     Mind sharing a testimonial? Just reply to this email.
 *
 *     Wes
 *     Founder, GitAuto
 */
const subjectLabel = (ownerName: string, repoCount: number, repoName: string | null) =>
  repoCount === 1 && repoName ? `${ownerName}/${repoName}` : ownerName;

export const generateOwnerCoverage80Subject = (
  ownerName: string,
  pct: number,
  repoCount: number,
  repoName: string | null,
) =>
  `${subjectLabel(ownerName, repoCount, repoName)}'s coverage is ${Math.round(pct)}% - nice work`;

export const generateOwnerCoverage80Email = (
  _ownerName: string,
  firstName: string,
  _pct: number,
  repoCount: number,
  _repoName: string | null,
) => {
  const weightedNote = repoCount > 1 ? ` This is weighted coverage across ${repoCount} repos.` : "";

  return `Hi ${firstName} - you're in great shape.${weightedNote} See the coverage chart:

${ABSOLUTE_URLS.GITAUTO.DASHBOARD.CHARTS}

Mind sharing a testimonial? Just reply to this email.

${EMAIL_SIGN_OFF}`;
};

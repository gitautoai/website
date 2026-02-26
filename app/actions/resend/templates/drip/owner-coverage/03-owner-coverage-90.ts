import { EMAIL_SIGN_OFF } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * Single repo example:
 *   Subject: acme/backend's coverage is 92% - elite territory
 *   Body:
 *     Hi Alice - ahead of most teams. See the coverage chart:
 *
 *     https://gitauto.ai/dashboard/charts
 *
 *     Know someone who'd benefit? Forward this email - I'd appreciate it.
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Multi repo example:
 *   Subject: acme's coverage is 92% - elite territory
 *   Body:
 *     Hi Alice - ahead of most teams. This is weighted coverage across 3 repos. See the chart:
 *
 *     https://gitauto.ai/dashboard/charts
 *
 *     Know someone who'd benefit? Forward this email - I'd appreciate it.
 *
 *     Wes
 *     Founder, GitAuto
 */
const subjectLabel = (ownerName: string, repoCount: number, repoName: string | null) =>
  repoCount === 1 && repoName ? `${ownerName}/${repoName}` : ownerName;

export const generateOwnerCoverage90Subject = (
  ownerName: string,
  pct: number,
  repoCount: number,
  repoName: string | null,
) =>
  `${subjectLabel(ownerName, repoCount, repoName)}'s coverage is ${Math.round(pct)}% - elite territory`;

export const generateOwnerCoverage90Email = (
  _ownerName: string,
  firstName: string,
  _pct: number,
  repoCount: number,
  _repoName: string | null,
) => {
  const weightedNote = repoCount > 1 ? ` This is weighted coverage across ${repoCount} repos.` : "";

  return `Hi ${firstName} - ahead of most teams.${weightedNote} See the coverage chart:

${ABSOLUTE_URLS.GITAUTO.DASHBOARD.CHARTS}

Know someone who'd benefit? Forward this email - I'd appreciate it.

${EMAIL_SIGN_OFF}`;
};

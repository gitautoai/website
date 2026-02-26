import { EMAIL_SIGN_OFF } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";
import type { OwnerContext } from "@/types/drip-emails";
import { formatLines } from "@/utils/format-lines";

/**
 * Single repo (with benchmark):
 *   Subject: Your test coverage is 15%
 *   Body:
 *     Hi Alice - I just measured your test coverage at 15% for acme/backend (~8K lines). For reference, a 5K-line project on GitAuto reached 89% coverage. See the chart:
 *
 *     https://gitauto.ai/dashboard/charts
 *
 *     Wes
 *     Founder, GitAuto
 *
 * Multi-repo (no benchmark):
 *   Subject: Your test coverage across 3 repos is 72%
 *   Body:
 *     Hi Alice - I just measured your weighted test coverage at 72% across 3 repos like acme/backend (~8K lines). See the chart:
 *
 *     https://gitauto.ai/dashboard/charts
 *
 *     Wes
 *     Founder, GitAuto
 */
export const generateCoverageChartsSubject = (ctx: OwnerContext) => {
  const pct = Math.round(ctx.ownerCoveragePct!);
  const repoLabel = ctx.coverageRepoCount > 1 ? ` across ${ctx.coverageRepoCount} repos` : "";
  return `Your test coverage${repoLabel} is ${pct}%`;
};

export const generateCoverageChartsEmail = (
  ownerName: string,
  firstName: string,
  ctx: OwnerContext,
) => {
  const pct = Math.round(ctx.ownerCoveragePct!);
  const multi = ctx.coverageRepoCount > 1;
  const repoName = ctx.repoMostNeedingCoverage ? `${ownerName}/${ctx.repoMostNeedingCoverage}` : "";
  const repoWithLines =
    repoName && ctx.repoMostNeedingCoverageLines
      ? `${repoName} (~${formatLines(ctx.repoMostNeedingCoverageLines)} lines)`
      : repoName;
  const repoDetail = multi
    ? ` across ${ctx.coverageRepoCount} repos${repoWithLines ? ` like ${repoWithLines}` : ""}`
    : repoWithLines
      ? ` for ${repoWithLines}`
      : "";
  const benchmarkLine = ctx.coverageBenchmark
    ? ` For reference, a ${formatLines(ctx.coverageBenchmark.linesTotal)}-line project on GitAuto reached ${ctx.coverageBenchmark.coveragePct}% coverage.`
    : "";

  return `Hi ${firstName} - your ${multi ? "weighted " : ""}test coverage just came in at ${pct}%${repoDetail}.${benchmarkLine} See the chart:

${ABSOLUTE_URLS.GITAUTO.DASHBOARD.CHARTS}

${EMAIL_SIGN_OFF}`;
};

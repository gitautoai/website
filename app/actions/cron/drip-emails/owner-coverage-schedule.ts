import {
  generateOwnerCoverage50Email,
  generateOwnerCoverage50Subject,
} from "@/app/actions/resend/templates/drip/owner-coverage/01-owner-coverage-50";
import {
  generateOwnerCoverage80Email,
  generateOwnerCoverage80Subject,
} from "@/app/actions/resend/templates/drip/owner-coverage/02-owner-coverage-80";
import {
  generateOwnerCoverage90Email,
  generateOwnerCoverage90Subject,
} from "@/app/actions/resend/templates/drip/owner-coverage/03-owner-coverage-90";
import type { OwnerCoverageThreshold } from "@/types/drip-emails";

export const coverageThresholds: OwnerCoverageThreshold[] = [
  {
    pct: 50,
    emailType: "owner_coverage_50_pct",
    subject: (ownerName, pct, repoCount, repoName) =>
      generateOwnerCoverage50Subject(ownerName, pct, repoCount, repoName),
    body: (ownerName, firstName, pct, repoCount, repoName) =>
      generateOwnerCoverage50Email(ownerName, firstName, pct, repoCount, repoName),
    shouldSkip: () => false,
    // Wait until GitAuto has merged PRs before asking for feedback
    shouldPause: (ctx) => !ctx.hasMergedPr,
  },
  {
    pct: 80,
    emailType: "owner_coverage_80_pct",
    subject: (ownerName, pct, repoCount, repoName) =>
      generateOwnerCoverage80Subject(ownerName, pct, repoCount, repoName),
    body: (ownerName, firstName, pct, repoCount, repoName) =>
      generateOwnerCoverage80Email(ownerName, firstName, pct, repoCount, repoName),
    shouldSkip: () => false,
    // Wait until GitAuto has merged PRs and user has paid before asking for a testimonial
    shouldPause: (ctx) => !ctx.hasMergedPr || !ctx.hasPurchasedCredits,
  },
  {
    pct: 90,
    emailType: "owner_coverage_90_pct",
    subject: (ownerName, pct, repoCount, repoName) =>
      generateOwnerCoverage90Subject(ownerName, pct, repoCount, repoName),
    body: (ownerName, firstName, pct, repoCount, repoName) =>
      generateOwnerCoverage90Email(ownerName, firstName, pct, repoCount, repoName),
    shouldSkip: () => false,
    // Wait until GitAuto has merged PRs and user has paid before asking for a referral
    shouldPause: (ctx) => !ctx.hasMergedPr || !ctx.hasPurchasedCredits,
  },
];

export type WelcomeEmailType = "welcome";

export type DripEmailType =
  | "dormant_reintro"
  | "onboarding_review_setup_pr"
  | "onboarding_coverage_charts"
  | "onboarding_set_target_branch"
  | "onboarding_schedule_triggers"
  | "onboarding_merge_test_pr"
  | "onboarding_purchase_credits";

export type CoverageThresholdEmailType =
  | "owner_coverage_50_pct"
  | "owner_coverage_80_pct"
  | "owner_coverage_90_pct";

export type EmailType = WelcomeEmailType | DripEmailType | CoverageThresholdEmailType;

/**
 * Pre-fetched owner context passed to each email's shouldSkip condition.
 * Data is batch-fetched once and shared across all schedule items.
 */
export interface OwnerContext {
  hasOwnerCoverage: boolean;
  ownerCoveragePct: number | null;
  coverageRepoCount: number;
  totalRepoCount: number;
  scheduledRepoCount: number;
  unscheduledRepoNames: string[];
  repoMostNeedingCoverage: string | null;
  repoMostNeedingCoveragePct: number | null;
  /** Anonymized similar-sized repo from another owner with higher coverage (>= 80%) */
  coverageBenchmark: { linesTotal: number; coveragePct: number } | null;
  hasSetupPr: boolean;
  hasSetupPrMerged: boolean;
  setupPrs: { repoName: string; prNumber: number }[];
  prCount: number;
  /** Open (non-merged) test PRs for direct linking in emails */
  openTestPrs: { ownerName: string; repoName: string; prNumber: number }[];
  hasPrs: boolean;
  hasMergedPr: boolean;
  hasPurchasedCredits: boolean;
  hasActiveSubscription: boolean;
  hasAutoReloadEnabled: boolean;
  creditBalanceUsd: number | null;
  /** ISO timestamp of when the GitHub App was installed */
  installedAt: string;
  /** ISO timestamp of most recent activity (PR created), or null if no PRs */
  lastActivityAt: string | null;
  /** Days since last activity (falls back to install date if no PRs) */
  daysSinceLastActivity: number;
  /** True if user has been inactive >= 7 days */
  isDormant: boolean;
  /** True if user has already received at least one onboarding email */
  hasReceivedOnboarding: boolean;
}

export interface DripScheduleItem {
  emailType: DripEmailType;
  subject: (ownerName: string, firstName: string, ctx: OwnerContext) => string;
  body: (ownerName: string, firstName: string, ctx: OwnerContext) => string;
  /** Return true to skip this email permanently (e.g., user already completed the action) */
  shouldSkip: (ctx: OwnerContext) => boolean;
  /** Return true to pause the drip here until the condition clears (e.g., waiting for coverage data) */
  shouldPause: (ctx: OwnerContext) => boolean;
}

export interface OwnerCoverageThreshold {
  pct: number;
  emailType: CoverageThresholdEmailType;
  subject: (ownerName: string, pct: number, repoCount: number, repoName: string | null) => string;
  body: (
    ownerName: string,
    firstName: string,
    pct: number,
    repoCount: number,
    repoName: string | null,
  ) => string;
  /** Return true to skip this threshold permanently */
  shouldSkip: (ctx: OwnerContext) => boolean;
  /** Return true to hold off sending until the condition clears (e.g., waiting for merged PRs) */
  shouldPause: (ctx: OwnerContext) => boolean;
}

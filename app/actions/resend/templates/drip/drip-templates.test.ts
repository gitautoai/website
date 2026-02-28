import {
  generateOwnerCoverage50Email,
  generateOwnerCoverage50Subject,
} from "./owner-coverage/01-owner-coverage-50";
import { generateOwnerCoverage80Email } from "./owner-coverage/02-owner-coverage-80";
import { generateOwnerCoverage90Email } from "./owner-coverage/03-owner-coverage-90";
import { generateCoverageChartsEmail } from "./onboarding/02-coverage-charts";
import { generateMergeTestPrEmail } from "./onboarding/04-merge-test-pr";
import { generatePurchaseCreditsEmail } from "./onboarding/05-purchase-credits";
import { generateReviewSetupPrEmail } from "./onboarding/01-review-setup-pr";
import { generateDormantReintroEmail } from "./re-engage/01-dormant-reintro";
import {
  generateSalvageHadSubscriptionEmail,
  generateSalvageHadSubscriptionSubject,
} from "@/app/actions/resend/templates/drip/re-engage/01-salvage-had-subscription";
import {
  generateSalvageMergedPrEmail,
  generateSalvageMergedPrSubject,
} from "@/app/actions/resend/templates/drip/re-engage/02-salvage-merged-pr";
import {
  generateSalvageHadPrEmail,
  generateSalvageHadPrSubject,
} from "@/app/actions/resend/templates/drip/re-engage/03-salvage-had-pr";
import {
  generateSalvageNoEngagementEmail,
  generateSalvageNoEngagementSubject,
} from "@/app/actions/resend/templates/drip/re-engage/04-salvage-no-engagement";
import {
  generateSalvageUninstallEmail,
  generateSalvageUninstallSubject,
} from "@/app/actions/cron/drip-emails/salvage-schedule";
import type { SalvageContext } from "@/app/actions/cron/drip-emails/salvage-schedule";
import { generateSetTargetBranchEmail } from "./onboarding/03-set-target-branch";
import type { OwnerContext } from "@/types/drip-emails";

const CHAR_LIMIT = 250;

const makeCtx = (overrides: Partial<OwnerContext> = {}): OwnerContext => ({
  hasOwnerCoverage: false,
  ownerCoveragePct: null,
  coverageRepoCount: 0,
  totalRepoCount: 2,
  scheduledRepoCount: 0,
  unscheduledRepoNames: ["api", "web"],
  repoMostNeedingCoverage: null,
  repoMostNeedingCoveragePct: null,
  repoMostNeedingCoverageLines: null,
  coverageBenchmark: null,
  hasSetupPr: false,
  hasSetupPrMerged: false,
  setupPrs: [],
  prCount: 0,
  openTestPrs: [],
  hasPrs: false,
  hasMergedPr: false,
  hasPurchasedCredits: false,
  hasActiveSubscription: false,
  hasAutoReloadEnabled: false,
  creditBalanceUsd: null,
  installedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  lastActivityAt: null,
  daysSinceLastActivity: 30,
  isDormant: true,
  hasReceivedOnboarding: false,
  ...overrides,
});

describe("drip email templates", () => {
  it("generateReviewSetupPrEmail with pending setup PRs", () => {
    const ctx = makeCtx({
      hasSetupPr: true,
      setupPrs: [
        { repoName: "backend", prNumber: 42 },
        { repoName: "frontend", prNumber: 7 },
      ],
    });
    const text = generateReviewSetupPrEmail("test-org", "Alice", ctx);
    expect(text).toContain("Alice");
    expect(text).toContain("https://github.com/test-org/backend/pull/42");
    expect(text).toContain("https://github.com/test-org/frontend/pull/7");
    expect(text).toContain("PRs");
    expect(text).toContain("are waiting");
    expect(text).toContain("Wes");
  });

  it("generateCoverageChartsEmail with single repo shows owner/repo and benchmark", () => {
    const ctx = makeCtx({
      hasOwnerCoverage: true,
      ownerCoveragePct: 42.7,
      coverageRepoCount: 1,
      repoMostNeedingCoverage: "backend",
      repoMostNeedingCoverageLines: 8200,
      coverageBenchmark: { linesTotal: 5303, coveragePct: 89 },
    });
    const text = generateCoverageChartsEmail("acme", "Alice", ctx);
    expect(text).toContain("Hi Alice");
    expect(text).toContain("43%");
    expect(text).toContain("acme/backend (~8K lines)");
    expect(text).not.toContain("across");
    expect(text).toContain("5K-line project on GitAuto reached 89% coverage");
    expect(text).toContain("/dashboard/charts");
    expect(text).toContain("Wes");
  });

  it("generateCoverageChartsEmail with multiple repos shows repo count", () => {
    const ctx = makeCtx({
      hasOwnerCoverage: true,
      ownerCoveragePct: 72,
      coverageRepoCount: 5,
      repoMostNeedingCoverage: "backend",
      repoMostNeedingCoverageLines: 12000,
    });
    const text = generateCoverageChartsEmail("acme", "Alice", ctx);
    expect(text).toContain("Hi Alice");
    expect(text).toContain("72%");
    expect(text).toContain("across 5 repos");
    expect(text).toContain("acme/backend (~12K lines)");
    expect(text).toContain("/dashboard/charts");
    expect(text).toContain("Wes");
  });

  it("generateSetTargetBranchEmail suggests repo most needing coverage", () => {
    const ctx = makeCtx({ repoMostNeedingCoverage: "backend", repoMostNeedingCoveragePct: 15 });
    const text = generateSetTargetBranchEmail("acme", "Alice", ctx);
    expect(text).toContain("Hi Alice");
    expect(text).toContain("acme/backend has the most uncovered code (15%)");
    expect(text).toContain("/settings/rules");
    expect(text).toContain("/settings/triggers");
    expect(text).toContain("Wes");
  });

  it("generateMergeTestPrEmail with PRs shows URLs", () => {
    const ctx = makeCtx({
      prCount: 3,
      openTestPrs: [
        { ownerName: "acme", repoName: "backend", prNumber: 12 },
        { ownerName: "acme", repoName: "frontend", prNumber: 34 },
        { ownerName: "acme", repoName: "api", prNumber: 56 },
      ],
      hasPrs: true,
    });
    const text = generateMergeTestPrEmail("Alice", ctx);
    expect(text).toContain("Hi Alice");
    expect(text).toContain("3 PRs adding unit tests");
    expect(text).toContain("merge it");
    expect(text).toContain("review comment");
    expect(text).toContain("https://github.com/acme/backend/pull/12");
    expect(text).toContain("https://github.com/acme/frontend/pull/34");
    expect(text).toContain("https://github.com/acme/api/pull/56");
    expect(text).toContain("Wes");
  });

  it("generatePurchaseCreditsEmail shows credit balance", () => {
    const ctx = makeCtx({ creditBalanceUsd: 14 });
    const text = generatePurchaseCreditsEmail("Alice", ctx);
    expect(text).toContain("Hi Alice");
    expect(text).toContain("$14");
    expect(text).toContain("/dashboard/credits");
    expect(text).toContain("Wes");
  });

  it("generatePurchaseCreditsEmail with zero balance says out of credits", () => {
    const ctx = makeCtx({ creditBalanceUsd: 0 });
    const text = generatePurchaseCreditsEmail("Alice", ctx);
    expect(text).toContain("Hi Alice");
    expect(text).toContain("out of credits");
    expect(text).toContain("Wes");
  });

  it("generateOwnerCoverage50Subject with single repo shows owner/repo", () => {
    const subject = generateOwnerCoverage50Subject("acme", 50.4, 1, "backend");
    expect(subject).toContain("acme/backend");
    expect(subject).toContain("50%");
  });

  it("generateOwnerCoverage50Subject with multi repo shows owner name", () => {
    const subject = generateOwnerCoverage50Subject("acme", 50.4, 3, null);
    expect(subject).toContain("acme's");
    expect(subject).toContain("50%");
  });

  it("generateOwnerCoverage50Email single repo has no weighted note", () => {
    const text = generateOwnerCoverage50Email("acme", "Alice", 50.4, 1, "backend");
    expect(text).toContain("Hi Alice");
    expect(text).not.toContain("weighted");
    expect(text).toContain("/dashboard/charts");
    expect(text).toContain("Reply");
    expect(text).toContain("Wes");
  });

  it("generateOwnerCoverage50Email multi repo mentions weighted", () => {
    const text = generateOwnerCoverage50Email("acme", "Alice", 50.4, 3, null);
    expect(text).toContain("weighted coverage across 3 repos");
    expect(text).toContain("/dashboard/charts");
  });

  it("generateOwnerCoverage80Email asks for testimonial", () => {
    const text = generateOwnerCoverage80Email("acme", "Alice", 82, 3, null);
    expect(text).toContain("Hi Alice");
    expect(text).toContain("great shape");
    expect(text).toContain("weighted coverage across 3 repos");
    expect(text).toContain("/dashboard/charts");
    expect(text).toContain("testimonial");
    expect(text).toContain("Wes");
  });

  it("generateOwnerCoverage90Email asks for referral", () => {
    const text = generateOwnerCoverage90Email("acme", "Alice", 92, 5, null);
    expect(text).toContain("Hi Alice");
    expect(text).toContain("ahead of most teams");
    expect(text).toContain("weighted coverage across 5 repos");
    expect(text).toContain("/dashboard/charts");
    expect(text).toContain("Forward");
    expect(text).toContain("Wes");
  });

  it("generateDormantReintroEmail re-introduces GitAuto with demo and onboarding teaser", () => {
    const ctx = makeCtx();
    const text = generateDormantReintroEmail("test-org", "Alice", ctx);
    expect(text).toContain("Alice");
    expect(text).toContain("your GitHub account test-org");
    expect(text).toContain("Remember? Sorry I didn't follow up sooner");
    expect(text).toContain("hit 90% coverage");
    expect(text).toContain("youtube.com");
    expect(text).toContain("share a few tips to get you set up");
    expect(text).toContain("Wes");
  });

  describe("salvage uninstall email variants", () => {
    const baseSalvageCtx: SalvageContext = {
      uninstalledAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      canceledAt: null,
      hadMergedPr: false,
      hadPr: false,
      hadSubscription: false,
      mergedPrCount: 0,
      prCount: 0,
    };

    it("all variants show reinstall link and value prop", () => {
      const text = generateSalvageNoEngagementEmail("Alice", baseSalvageCtx);
      expect(text).toContain("Alice");
      expect(text).toContain("youtube.com");
      expect(text).toContain("github.com/apps/gitauto-ai");
      expect(text).toContain("Wes");
    });

    it("merged PR variant mentions count and improving", () => {
      const text = generateSalvageMergedPrEmail("Alice", {
        ...baseSalvageCtx,
        hadMergedPr: true,
        mergedPrCount: 3,
      });
      expect(text).toContain("merged 3 GitAuto PRs");
      expect(text).toContain("improved");
    });

    it("all variants include value prop", () => {
      const text = generateSalvageHadPrEmail("Alice", {
        ...baseSalvageCtx,
        hadPr: true,
        prCount: 5,
      });
      expect(text).toContain("fire-and-forget");
      expect(text).toContain("hit 90% coverage");
      expect(text).toContain("youtube.com");
    });

    it("each variant has a distinct subject", () => {
      expect(generateSalvageHadSubscriptionSubject("acme")).toContain("changed");
      expect(generateSalvageMergedPrSubject("acme")).toContain("coverage");
      expect(
        generateSalvageHadPrSubject("acme", { ...baseSalvageCtx, hadPr: true, prCount: 4 }),
      ).toContain("better");
      expect(generateSalvageNoEngagementSubject("acme")).toContain("quick look");
    });

    it("subject router picks correct variant based on context", () => {
      expect(
        generateSalvageUninstallSubject("acme", { ...baseSalvageCtx, hadSubscription: true }),
      ).toContain("changed");
      expect(
        generateSalvageUninstallSubject("acme", { ...baseSalvageCtx, hadMergedPr: true }),
      ).toContain("coverage");
      expect(
        generateSalvageUninstallSubject("acme", { ...baseSalvageCtx, hadPr: true, prCount: 3 }),
      ).toContain("better");
      expect(generateSalvageUninstallSubject("acme", baseSalvageCtx)).toContain("quick look");
    });

    it("body router picks correct variant based on context", () => {
      const mergedText = generateSalvageUninstallEmail("Alice", {
        ...baseSalvageCtx,
        hadMergedPr: true,
        mergedPrCount: 5,
      });
      expect(mergedText).toContain("merged 5 GitAuto PRs");
    });
  });

  describe("character limit", () => {
    it(`generateReviewSetupPrEmail with setup PRs is within ${CHAR_LIMIT} chars`, () => {
      const ctx = makeCtx({
        setupPrs: [
          { repoName: "backend", prNumber: 42 },
          { repoName: "frontend", prNumber: 7 },
          { repoName: "api", prNumber: 99 },
        ],
      });
      const text = generateReviewSetupPrEmail("long-org-name", "Maximilian", ctx);
      expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
    });

    it(`generateCoverageChartsEmail with coverage is within ${CHAR_LIMIT} chars`, () => {
      const ctx = makeCtx({
        ownerCoveragePct: 99.9,
        coverageRepoCount: 99,
        repoMostNeedingCoverage: "long-repo-name",
        repoMostNeedingCoverageLines: 999000,
      });
      const text = generateCoverageChartsEmail("long-org-name", "Maximilian", ctx);
      expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
    });

    it(`generateSetTargetBranchEmail is within ${CHAR_LIMIT} chars`, () => {
      const ctx = makeCtx({
        repoMostNeedingCoverage: "long-repo-name",
        repoMostNeedingCoveragePct: 15,
      });
      const text = generateSetTargetBranchEmail("long-org-name", "Maximilian", ctx);
      expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
    });

    it(`generateMergeTestPrEmail with PRs is within ${CHAR_LIMIT} chars`, () => {
      const ctx = makeCtx({ prCount: 999, hasPrs: true });
      const text = generateMergeTestPrEmail("Maximilian", ctx);
      expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
    });

    it(`generatePurchaseCreditsEmail with balance is within ${CHAR_LIMIT} chars`, () => {
      const ctx = makeCtx({ creditBalanceUsd: 9999 });
      const text = generatePurchaseCreditsEmail("Maximilian", ctx);
      expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
    });

    it(`generateOwnerCoverage50Email is within ${CHAR_LIMIT} chars`, () => {
      const text = generateOwnerCoverage50Email("long-org-name", "Maximilian", 50, 99, null);
      expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
    });

    it(`generateOwnerCoverage80Email is within ${CHAR_LIMIT} chars`, () => {
      const text = generateOwnerCoverage80Email("long-org-name", "Maximilian", 82, 99, null);
      expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
    });

    it(`generateOwnerCoverage90Email is within ${CHAR_LIMIT} chars`, () => {
      const text = generateOwnerCoverage90Email("long-org-name", "Maximilian", 92, 99, null);
      expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
    });

    // Salvage emails include the full value prop paragraph (like dormant reintro)
    // so they exceed the 250 char limit used for onboarding drips. No char limit test needed.
  });
});

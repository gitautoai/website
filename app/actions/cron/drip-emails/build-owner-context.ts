import { findBenchmark } from "./find-benchmark";
import { parseName } from "@/utils/parse-name";
import type { OwnerContext } from "@/types/drip-emails";
import type { BatchQueryResults } from "./fetch-batch-data";

export interface UserInfo {
  email: string;
  firstName: string;
}

export interface OwnerLookups {
  getUserInfo: (ownerId: number) => UserInfo | null;
  getSentEmails: (ownerId: number) => Set<string>;
  buildContext: (ownerId: number) => OwnerContext;
}

export const buildOwnerContext = (data: BatchQueryResults): OwnerLookups => {
  // owner_id → user_id (parse "user_id:user_name" format)
  const ownerUserMap: Record<number, number> = {};
  const ownerCreditBalance: Record<number, number | null> = {};
  const ownerHasActiveSub = new Set<number>();
  const ownerHasAutoReload = new Set<number>();
  for (const owner of data.owners) {
    if (owner.created_by) {
      const userId = parseInt(owner.created_by.split(":")[0], 10);
      if (!isNaN(userId)) ownerUserMap[owner.owner_id] = userId;
    }
    ownerCreditBalance[owner.owner_id] = owner.credit_balance_usd;
    if (owner.stripe_customer_id && data.activeSubCustomerIds.has(owner.stripe_customer_id))
      ownerHasActiveSub.add(owner.owner_id);
    if (owner.auto_reload_enabled) ownerHasAutoReload.add(owner.owner_id);
  }

  // Repository schedule counts
  const ownerTotalRepos: Record<number, number> = {};
  const ownerScheduledRepos: Record<number, number> = {};
  const ownerUnscheduledRepoNames: Record<number, string[]> = {};
  for (const repo of data.repos) {
    ownerTotalRepos[repo.owner_id] = (ownerTotalRepos[repo.owner_id] || 0) + 1;
    if (repo.trigger_on_schedule) {
      ownerScheduledRepos[repo.owner_id] = (ownerScheduledRepos[repo.owner_id] || 0) + 1;
    } else {
      if (!ownerUnscheduledRepoNames[repo.owner_id]) ownerUnscheduledRepoNames[repo.owner_id] = [];
      ownerUnscheduledRepoNames[repo.owner_id].push(repo.repo_name);
    }
  }

  // Purchased credits
  const ownerHasPurchased = new Set(data.purchaseOwnerIds);

  // Usage: split by trigger type, deduplicate PRs
  const ownerHasSetupPr = new Set<number>();
  const ownerHasSetupPrMerged = new Set<number>();
  const ownerSetupPrMap: Record<number, Map<string, { repoName: string; prNumber: number }>> = {};
  const prSets: Record<number, Set<string>> = {};
  const mergedPrKeys: Record<number, Set<string>> = {};
  for (const row of data.usageRows) {
    if (row.trigger === "setup") {
      ownerHasSetupPr.add(row.owner_id);
      if (!row.is_merged && row.pr_number) {
        if (!ownerSetupPrMap[row.owner_id]) ownerSetupPrMap[row.owner_id] = new Map();
        ownerSetupPrMap[row.owner_id].set(`${row.repo_name}#${row.pr_number}`, {
          repoName: row.repo_name,
          prNumber: row.pr_number,
        });
      }
      if (row.is_merged) ownerHasSetupPrMerged.add(row.owner_id);
    } else {
      const key = `${row.owner_name}/${row.repo_name}#${row.pr_number}`;
      if (!prSets[row.owner_id]) prSets[row.owner_id] = new Set();
      prSets[row.owner_id].add(key);
      if (row.is_merged) {
        if (!mergedPrKeys[row.owner_id]) mergedPrKeys[row.owner_id] = new Set();
        mergedPrKeys[row.owner_id].add(key);
      }
    }
  }

  // User emails
  const userEmailMap: Record<number, { email: string; displayName: string }> = {};
  for (const user of data.users) {
    if (user.email)
      userEmailMap[user.user_id] = {
        email: user.email,
        displayName: user.display_name || user.user_name,
      };
  }

  // Coverage: latest total coverage per owner
  const latestCoverageByOwner: Record<number, number> = {};
  for (const row of data.totalCoverageRows) {
    if (row.owner_id === null || row.statement_coverage === null) continue;
    if (latestCoverageByOwner[row.owner_id] === undefined)
      latestCoverageByOwner[row.owner_id] = row.statement_coverage;
  }

  // Coverage: latest per owner+repo (rows ordered by created_at DESC)
  const latestRepoCov: Record<number, Record<string, { lines_total: number; lines_covered: number }>> =
    {};
  for (const row of data.repoCoverageRows) {
    if (!latestRepoCov[row.owner_id]) latestRepoCov[row.owner_id] = {};
    if (!latestRepoCov[row.owner_id][row.repo_name])
      latestRepoCov[row.owner_id][row.repo_name] = row;
  }

  // Find repo most needing coverage per owner
  const coverageRepoCountByOwner: Record<number, number> = {};
  const repoMostNeedingCoverageByOwner: Record<number, string | null> = {};
  const repoMostNeedingCoveragePctByOwner: Record<number, number | null> = {};
  for (const [ownerIdStr, repos] of Object.entries(latestRepoCov)) {
    const ownerId = Number(ownerIdStr);
    coverageRepoCountByOwner[ownerId] = Object.keys(repos).length;
    let maxUncovered = 0;
    let bestRepo: string | null = null;
    for (const [repo, row] of Object.entries(repos)) {
      const uncovered = row.lines_total - row.lines_covered;
      if (uncovered > maxUncovered) {
        maxUncovered = uncovered;
        bestRepo = repo;
      }
    }
    repoMostNeedingCoverageByOwner[ownerId] = bestRepo;
    if (bestRepo && repos[bestRepo]) {
      const r = repos[bestRepo];
      repoMostNeedingCoveragePctByOwner[ownerId] = Math.round(
        (r.lines_covered / r.lines_total) * 100,
      );
    }
  }

  // Global repo stats for benchmark comparison (latest row per owner+repo)
  const globalLatest: Record<string, { ownerId: number; linesTotal: number; linesCovered: number }> =
    {};
  for (const row of data.globalRepoCoverageRows) {
    const key = `${row.owner_id}:${row.repo_name}`;
    if (!globalLatest[key])
      globalLatest[key] = {
        ownerId: row.owner_id,
        linesTotal: row.lines_total,
        linesCovered: row.lines_covered,
      };
  }
  const allRepoStats = Object.values(globalLatest).map((r) => ({
    ownerId: r.ownerId,
    repoName: "",
    linesTotal: r.linesTotal,
    coveragePct: (r.linesCovered / r.linesTotal) * 100,
  }));

  return {
    getUserInfo: (ownerId) => {
      const userId = ownerUserMap[ownerId];
      if (!userId) return null;
      const user = userEmailMap[userId];
      if (!user) return null;
      const { firstName } = parseName(user.displayName);
      return { email: user.email, firstName };
    },

    getSentEmails: (ownerId) => data.sentEmails[ownerId] || new Set(),

    buildContext: (ownerId) => {
      const prCount = prSets[ownerId]?.size || 0;
      return {
        hasOwnerCoverage: latestCoverageByOwner[ownerId] !== undefined,
        ownerCoveragePct: latestCoverageByOwner[ownerId] ?? null,
        coverageRepoCount: coverageRepoCountByOwner[ownerId] || 0,
        totalRepoCount: ownerTotalRepos[ownerId] || 0,
        scheduledRepoCount: ownerScheduledRepos[ownerId] || 0,
        unscheduledRepoNames: ownerUnscheduledRepoNames[ownerId] || [],
        repoMostNeedingCoverage: repoMostNeedingCoverageByOwner[ownerId] ?? null,
        repoMostNeedingCoveragePct: repoMostNeedingCoveragePctByOwner[ownerId] ?? null,
        coverageBenchmark: (() => {
          const repo = repoMostNeedingCoverageByOwner[ownerId];
          const ownerRepos = latestRepoCov[ownerId];
          if (!repo || !ownerRepos?.[repo]) return null;
          const targetLines = ownerRepos[repo].lines_total;
          const targetPct = repoMostNeedingCoveragePctByOwner[ownerId] ?? 0;
          return findBenchmark(ownerId, targetLines, targetPct, allRepoStats);
        })(),
        hasSetupPr: ownerHasSetupPr.has(ownerId),
        hasSetupPrMerged: ownerHasSetupPrMerged.has(ownerId),
        setupPrs: ownerSetupPrMap[ownerId] ? [...ownerSetupPrMap[ownerId].values()] : [],
        prCount,
        openTestPrs: [...(prSets[ownerId] || [])]
          .filter((key) => !mergedPrKeys[ownerId]?.has(key))
          .map((key) => {
            const [ownerRepo, prNum] = key.split("#");
            const [ownerName, repoName] = ownerRepo.split("/");
            return { ownerName, repoName, prNumber: Number(prNum) };
          }),
        hasPrs: prCount > 0,
        hasMergedPr: (mergedPrKeys[ownerId]?.size || 0) > 0,
        hasPurchasedCredits: ownerHasPurchased.has(ownerId),
        hasActiveSubscription: ownerHasActiveSub.has(ownerId),
        hasAutoReloadEnabled: ownerHasAutoReload.has(ownerId),
        creditBalanceUsd: ownerCreditBalance[ownerId] ?? null,
      };
    },
  };
};

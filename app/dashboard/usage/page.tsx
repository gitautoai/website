"use client";
// Third party imports
import { useEffect, useState } from "react";

// Local imports (Relative paths)
import RepositorySelector from "../../settings/components/RepositorySelector";
import { usageJsonLd } from "./jsonld";
import { PullRequestStats } from "./types";

// Local imports
import { createCustomerPortalSession } from "@/app/actions/stripe/create-customer-portal-session";
import { getOpenPRNumbers } from "@/app/actions/github/get-open-pr-numbers";
import { getPRCheckStatuses } from "@/app/actions/github/get-pr-check-statuses";
import { updatePRBranches } from "@/app/actions/github/update-pr-branches";
import { getUsageStats } from "@/app/actions/supabase/usage/get-usage-stats";
import { useAccountContext } from "@/app/components/contexts/Account";
import InfoIcon from "@/app/components/InfoIcon";
import Modal from "@/app/components/Modal";
import PeriodSelector, { Period, calculatePeriodDates } from "@/app/components/PeriodSelector";
import ReloadButton from "@/app/components/ReloadButton";
import SpinnerIcon from "@/app/components/SpinnerIcon";

const DEFAULT_PERIOD: Period = { type: "this-month", label: "This Month" };

type RepoStats = {
  all_time: PullRequestStats;
  selected_period: PullRequestStats;
};

type AllRepoStatsCache = Record<string, RepoStats>; // key: repoName

export default function UsagePage() {
  const [error, setError] = useState<string | null>(null);
  const {
    userId,
    currentOwnerName,
    currentRepoName,
    currentStripeCustomerId,
    currentInstallationId,
    organizations,
  } = useAccountContext();
  const [allRepoStats, setAllRepoStats] = useState<AllRepoStatsCache>({});
  const [totalStats, setTotalStats] = useState<RepoStats | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [updatingRepo, setUpdatingRepo] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(DEFAULT_PERIOD);
  const [updateResult, setUpdateResult] = useState<{
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [reloadingRepos, setReloadingRepos] = useState<Set<string>>(new Set());

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load saved period from localStorage on mount
  useEffect(() => {
    const savedPeriod = localStorage.getItem("usage-period");
    if (savedPeriod) {
      try {
        const parsed = JSON.parse(savedPeriod);
        setSelectedPeriod(parsed);
      } catch (error) {
        console.error("Failed to parse saved period from localStorage:", error);
      }
    }
  }, []);

  // Save period to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("usage-period", JSON.stringify(selectedPeriod));
  }, [selectedPeriod]);

  // Load cached data from localStorage on mount
  useEffect(() => {
    if (!currentOwnerName) return;

    const cacheKey = `usage-stats-${currentOwnerName}-${selectedPeriod.type}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        setAllRepoStats(parsedCache.allRepoStats || {});
        setTotalStats(parsedCache.totalStats || null);
      } catch (error) {
        console.error("Failed to parse cached stats:", error);
      }
    }
  }, [currentOwnerName, selectedPeriod.type]);

  // Fetch stats for a single repo
  const fetchRepoStats = async (repoName: string) => {
    if (!currentOwnerName || !currentInstallationId) return null;

    const { startDate, endDate } = calculatePeriodDates(selectedPeriod);

    const historicalStats = await getUsageStats({
      ownerName: currentOwnerName,
      repoName,
      periodStart: startDate,
      periodEnd: endDate,
    });

    let livePRStats = {
      total_open_prs: 0,
      total_passing_prs: 0,
    };

    try {
      const openPRs = await getOpenPRNumbers({
        ownerName: currentOwnerName,
        repoName,
        installationId: currentInstallationId,
      });

      const prNumbers = openPRs.map((pr) => pr.number);

      const checkStatuses = await getPRCheckStatuses({
        ownerName: currentOwnerName,
        repoName,
        installationId: currentInstallationId,
        prNumbers,
      });

      livePRStats = {
        total_open_prs: openPRs.length,
        total_passing_prs: checkStatuses.filter((status) => status.isTestPassed).length,
      };
    } catch (githubError: any) {
      console.error(`GitHub PR stats failed for ${repoName}:`, githubError.message);
    }

    return {
      repoName,
      stats: {
        all_time: { ...historicalStats.all_time, ...livePRStats },
        selected_period: { ...historicalStats.selected_period, ...livePRStats },
      },
    };
  };

  // Fetch ALL repos stats when owner or period changes
  useEffect(() => {
    const fetchAllReposStats = async () => {
      if (!currentStripeCustomerId || !currentOwnerName || !userId || !currentInstallationId)
        return;

      const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
      if (!currentOrg || currentOrg.repositories.length === 0) return;

      try {
        setError(null);

        // Mark all repos as loading
        const repoNames = currentOrg.repositories.map((r) => r.repoName);
        setReloadingRepos(new Set(repoNames));

        const allStats = await Promise.all(
          currentOrg.repositories.map((repo) => fetchRepoStats(repo.repoName))
        );

        // Build stats cache
        const statsCache: AllRepoStatsCache = {};
        allStats.forEach((item) => {
          if (item) statsCache[item.repoName] = item.stats;
        });

        // Calculate total stats
        const total = allStats.reduce(
          (acc, item) => {
            if (!item) return acc;
            return {
              all_time: {
                total_issues: acc.all_time.total_issues + item.stats.all_time.total_issues,
                total_prs: acc.all_time.total_prs + item.stats.all_time.total_prs,
                total_merges: acc.all_time.total_merges + item.stats.all_time.total_merges,
                total_open_prs: acc.all_time.total_open_prs + item.stats.all_time.total_open_prs,
                total_passing_prs:
                  acc.all_time.total_passing_prs + item.stats.all_time.total_passing_prs,
              },
              selected_period: {
                total_issues:
                  acc.selected_period.total_issues + item.stats.selected_period.total_issues,
                total_prs: acc.selected_period.total_prs + item.stats.selected_period.total_prs,
                total_merges:
                  acc.selected_period.total_merges + item.stats.selected_period.total_merges,
                total_open_prs:
                  acc.selected_period.total_open_prs + item.stats.selected_period.total_open_prs,
                total_passing_prs:
                  acc.selected_period.total_passing_prs +
                  item.stats.selected_period.total_passing_prs,
              },
            };
          },
          {
            all_time: {
              total_issues: 0,
              total_prs: 0,
              total_merges: 0,
              total_open_prs: 0,
              total_passing_prs: 0,
            },
            selected_period: {
              total_issues: 0,
              total_prs: 0,
              total_merges: 0,
              total_open_prs: 0,
              total_passing_prs: 0,
            },
          }
        );

        setAllRepoStats(statsCache);
        setTotalStats(total);

        // Save to localStorage
        const cacheKey = `usage-stats-${currentOwnerName}-${selectedPeriod.type}`;
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            allRepoStats: statsCache,
            totalStats: total,
            timestamp: Date.now(),
          })
        );
      } catch (error: any) {
        setError("Failed to load usage statistics");
        console.error("Error loading usage statistics:", error);
      } finally {
        setReloadingRepos(new Set());
      }
    };

    fetchAllReposStats();
  }, [
    currentStripeCustomerId,
    currentOwnerName,
    userId,
    selectedPeriod,
    currentInstallationId,
    organizations,
  ]);

  const formatNumber = (value?: number) => {
    if (!value) return "-";
    return value.toLocaleString();
  };

  const calculateMergeRate = (merges: number, totalPRs: number): string => {
    if (!totalPRs || totalPRs === 0) return "0%";
    const rate = (merges / totalPRs) * 100;
    return `${rate.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPeriodRange = (period: Period) => {
    const { startDate, endDate } = calculatePeriodDates(period);

    if (!startDate || !endDate) return "";

    let displayStartDate = new Date(startDate);
    let displayEndDate = new Date(endDate);

    if (
      period.type === "this-month" ||
      period.type === "last-month" ||
      period.type === "this-year"
    ) {
      // These use exclusive end dates (start of next period), so subtract 1 day
      displayEndDate.setDate(displayEndDate.getDate() - 1);
    } else if (period.type === "custom") {
      // For custom dates, use the exact date selected without timezone conversion
      displayStartDate = new Date(startDate.split("T")[0]);
      displayEndDate = new Date(endDate.split("T")[0]);
    }
    // For last-X-months, endDate is already today (inclusive)

    return `${formatDate(displayStartDate.toISOString())} - ${formatDate(displayEndDate.toISOString())}`;
  };

  const handleManageCredits = async () => {
    if (!currentStripeCustomerId) return;

    setIsPortalLoading(true);
    try {
      const portalUrl = await createCustomerPortalSession({
        stripe_customer_id: currentStripeCustomerId,
        return_url: window.location.href,
      });
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error opening portal:", error);
    } finally {
      setIsPortalLoading(false);
    }
  };

  const handleReloadRepo = async (repoName: string) => {
    setReloadingRepos((prev) => new Set(prev).add(repoName));
    try {
      const result = await fetchRepoStats(repoName);
      if (!result) return;

      setAllRepoStats((prev) => ({ ...prev, [result.repoName]: result.stats }));

      // Recalculate totals if in "All" view
      if (currentRepoName === "__ALL__") {
        const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
        if (currentOrg) {
          const updatedStats = { ...allRepoStats, [result.repoName]: result.stats };
          const total = Object.values(updatedStats).reduce(
            (acc, stats) => ({
              all_time: {
                total_issues: acc.all_time.total_issues + stats.all_time.total_issues,
                total_prs: acc.all_time.total_prs + stats.all_time.total_prs,
                total_merges: acc.all_time.total_merges + stats.all_time.total_merges,
                total_open_prs: acc.all_time.total_open_prs + stats.all_time.total_open_prs,
                total_passing_prs:
                  acc.all_time.total_passing_prs + stats.all_time.total_passing_prs,
              },
              selected_period: {
                total_issues: acc.selected_period.total_issues + stats.selected_period.total_issues,
                total_prs: acc.selected_period.total_prs + stats.selected_period.total_prs,
                total_merges: acc.selected_period.total_merges + stats.selected_period.total_merges,
                total_open_prs:
                  acc.selected_period.total_open_prs + stats.selected_period.total_open_prs,
                total_passing_prs:
                  acc.selected_period.total_passing_prs + stats.selected_period.total_passing_prs,
              },
            }),
            {
              all_time: {
                total_issues: 0,
                total_prs: 0,
                total_merges: 0,
                total_open_prs: 0,
                total_passing_prs: 0,
              },
              selected_period: {
                total_issues: 0,
                total_prs: 0,
                total_merges: 0,
                total_open_prs: 0,
                total_passing_prs: 0,
              },
            }
          );
          setTotalStats(total);
        }
      }
    } catch (error) {
      console.error(`Error reloading repo ${repoName}:`, error);
    } finally {
      setReloadingRepos((prev) => {
        const next = new Set(prev);
        next.delete(repoName);
        return next;
      });
    }
  };

  const handleUpdatePRBranches = async (repoName?: string) => {
    const targetRepo = repoName || currentRepoName;
    if (!currentOwnerName || !targetRepo || !currentInstallationId) return;

    // When "All" is selected, update all repos
    if (targetRepo === "__ALL__") {
      if (!currentOrg2) return;

      setUpdatingRepo("__ALL__");
      try {
        let totalResult = { total: 0, successful: 0, skipped: 0, failed: 0 };

        for (const repo of currentOrg2.repositories) {
          const openPRs = await getOpenPRNumbers({
            ownerName: currentOwnerName,
            repoName: repo.repoName,
            installationId: currentInstallationId,
          });
          const prNumbers = openPRs.map((pr) => pr.number);
          const result = await updatePRBranches({
            ownerName: currentOwnerName,
            repoName: repo.repoName,
            installationId: currentInstallationId,
            prNumbers,
          });

          totalResult.total += result.total;
          totalResult.successful += result.successful;
          totalResult.skipped += result.skipped;
          totalResult.failed += result.failed;
        }

        setUpdateResult(totalResult);
      } catch (error) {
        console.error("Error updating PR branches:", error);
        setUpdateResult({ total: 0, successful: 0, skipped: 0, failed: -1 });
      } finally {
        setUpdatingRepo(null);
      }
      return;
    }

    // Update single repo
    setUpdatingRepo(targetRepo);
    try {
      const openPRs = await getOpenPRNumbers({
        ownerName: currentOwnerName,
        repoName: targetRepo,
        installationId: currentInstallationId,
      });
      const prNumbers = openPRs.map((pr) => pr.number);
      const result = await updatePRBranches({
        ownerName: currentOwnerName,
        repoName: targetRepo,
        installationId: currentInstallationId,
        prNumbers,
      });

      setUpdateResult(result);
    } catch (error) {
      console.error("Error updating PR branches:", error);
      setUpdateResult({ total: 0, successful: 0, skipped: 0, failed: -1 });
    } finally {
      setUpdatingRepo(null);
    }
  };

  const StatBlock = ({
    title,
    selectedPeriodValue,
    showManageCredits,
    showUpdatePRs,
    repoName,
    tooltip,
    showMergeRate,
    selectedPeriodTotalPRs,
  }: {
    title: string;
    selectedPeriodValue: number;
    showManageCredits?: boolean;
    showUpdatePRs?: boolean;
    repoName?: string;
    tooltip?: string;
    showMergeRate?: boolean;
    selectedPeriodTotalPRs?: number;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 min-h-[3.5rem]">
        {title}
        {tooltip && <InfoIcon tooltip={tooltip} />}
      </h3>
      <div className="space-y-2">
        <div>
          <p className="text-2xl font-bold">
            {formatNumber(selectedPeriodValue)}
            {showMergeRate && selectedPeriodTotalPRs !== undefined && (
              <span className="text-lg text-gray-600 ml-2">
                ({calculateMergeRate(selectedPeriodValue, selectedPeriodTotalPRs)})
              </span>
            )}
          </p>
          {showManageCredits && (
            <button
              onClick={handleManageCredits}
              disabled={isPortalLoading}
              className="text-sm text-pink-600 hover:text-pink-700 mt-2 flex items-center gap-1 hover:underline"
            >
              {isPortalLoading ? (
                <>
                  <SpinnerIcon />
                  Opening portal...
                </>
              ) : (
                "Add Credits"
              )}
            </button>
          )}
          {showUpdatePRs && (
            <button
              onClick={() => handleUpdatePRBranches(repoName)}
              disabled={updatingRepo === repoName}
              className="text-left text-sm text-pink-600 hover:text-pink-700 mt-2 flex items-center gap-1 hover:underline"
            >
              {updatingRepo === repoName ? (
                <>
                  <SpinnerIcon />
                  Updating branches...
                </>
              ) : (
                "Update All PR Branches"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Determine what to display based on selection
  const isAllRepos = currentRepoName === "__ALL__";
  const displayStats = isAllRepos ? totalStats : allRepoStats[currentRepoName || ""];
  const currentOrg2 = organizations.find((org) => org.ownerName === currentOwnerName);
  const reposToDisplay =
    isMounted && isAllRepos ? currentOrg2?.repositories.map((r) => r.repoName) || [] : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(usageJsonLd) }}
      />
      <div className="min-h-screen flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Usage Statistics</h1>
        <RepositorySelector />
        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {selectedPeriod.type !== "all-time" && (
          <p className="text-gray-600">
            {selectedPeriod.label}: {formatPeriodRange(selectedPeriod)}
          </p>
        )}

        {/* Display total + each repo when "All" is selected */}
        {isAllRepos && displayStats && (
          <div className="space-y-8">
            {/* Total stats */}
            <div>
              <h2 className="text-xl font-semibold mt-2 mb-4">Total (All Repositories)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatBlock
                  title="Total Issues"
                  selectedPeriodValue={displayStats.selected_period.total_issues}
                  showManageCredits={true}
                  tooltip="Number of issues created by GitAuto across all repositories."
                />
                <StatBlock
                  title="Total Pull Requests"
                  selectedPeriodValue={displayStats.selected_period.total_prs}
                  tooltip="Number of pull requests generated by GitAuto across all repositories."
                />
                <StatBlock
                  title="Total Open PRs"
                  selectedPeriodValue={displayStats.selected_period.total_open_prs}
                  showUpdatePRs={true}
                  repoName="__ALL__"
                  tooltip="Number of pull requests that are currently open across all repositories."
                />
                <StatBlock
                  title="Total Passing PRs"
                  selectedPeriodValue={displayStats.selected_period.total_passing_prs}
                  tooltip="Number of open pull requests where all tests are passing across all repositories."
                />
                <StatBlock
                  title="Total Merged PRs"
                  selectedPeriodValue={displayStats.selected_period.total_merges}
                  tooltip="Number of pull requests that were successfully merged across all repositories."
                  showMergeRate={true}
                  selectedPeriodTotalPRs={displayStats.selected_period.total_prs}
                />
              </div>
            </div>

            {/* Each repo stats */}
            {reposToDisplay.map((repoName) => {
              const repoStat = allRepoStats[repoName];
              if (!repoStat) return null;

              return (
                <div key={repoName}>
                  <h2 className="text-xl font-semibold mt-2 mb-4 flex items-center gap-2">
                    {repoName}
                    <ReloadButton
                      onClick={() => handleReloadRepo(repoName)}
                      isLoading={reloadingRepos.has(repoName)}
                    />
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <StatBlock
                      title="Total Issues"
                      selectedPeriodValue={repoStat.selected_period.total_issues}
                      tooltip="Number of issues created by GitAuto for this repository."
                    />
                    <StatBlock
                      title="Total Pull Requests"
                      selectedPeriodValue={repoStat.selected_period.total_prs}
                      tooltip="Number of pull requests generated by GitAuto for this repository."
                    />
                    <StatBlock
                      title="Total Open PRs"
                      selectedPeriodValue={repoStat.selected_period.total_open_prs}
                      showUpdatePRs={true}
                      repoName={repoName}
                      tooltip="Number of pull requests that are currently open."
                    />
                    <StatBlock
                      title="Total Passing PRs"
                      selectedPeriodValue={repoStat.selected_period.total_passing_prs}
                      tooltip="Number of open pull requests where all tests are passing."
                    />
                    <StatBlock
                      title="Total Merged PRs"
                      selectedPeriodValue={repoStat.selected_period.total_merges}
                      tooltip="Number of pull requests that were successfully merged."
                      showMergeRate={true}
                      selectedPeriodTotalPRs={repoStat.selected_period.total_prs}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Display single repo stats */}
        {!isAllRepos && displayStats && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mt-2 mb-4 flex items-center gap-2">
                {currentRepoName}
                <ReloadButton
                  onClick={() => currentRepoName && handleReloadRepo(currentRepoName)}
                  isLoading={currentRepoName ? reloadingRepos.has(currentRepoName) : false}
                />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatBlock
                  title="Total Issues"
                  selectedPeriodValue={displayStats.selected_period.total_issues}
                  showManageCredits={true}
                  tooltip="Number of issues created by GitAuto for this repository."
                />
                <StatBlock
                  title="Total Pull Requests"
                  selectedPeriodValue={displayStats.selected_period.total_prs}
                  tooltip="Number of pull requests generated by GitAuto for this repository."
                />
                <StatBlock
                  title="Total Open PRs"
                  selectedPeriodValue={displayStats.selected_period.total_open_prs}
                  showUpdatePRs={true}
                  repoName={currentRepoName || undefined}
                  tooltip="Number of pull requests that are currently open (not merged)."
                />
                <StatBlock
                  title="Total Passing PRs"
                  selectedPeriodValue={displayStats.selected_period.total_passing_prs}
                  tooltip="Number of open pull requests where all tests are passing."
                />
                <StatBlock
                  title="Total Merged PRs"
                  selectedPeriodValue={displayStats.selected_period.total_merges}
                  tooltip="Number of pull requests that were successfully merged into the repository. Merge rate percentage is calculated as (merged PRs / total PRs) × 100."
                  showMergeRate={true}
                  selectedPeriodTotalPRs={displayStats.selected_period.total_prs}
                />
              </div>
            </div>
          </div>
        )}

        {updateResult && (
          <Modal
            title={updateResult.failed === -1 ? "Update Failed" : "PR Branches Updated"}
            type={updateResult.failed === -1 ? "error" : "success"}
            message={
              updateResult.failed === -1
                ? "Failed to update PR branches. Please try again."
                : `Updated ${updateResult.successful} out of ${updateResult.total} PR branches.${updateResult.skipped > 0 ? ` ${updateResult.skipped} already up to date.` : ""}${updateResult.failed > 0 ? ` ${updateResult.failed} failed.` : ""}`
            }
            onClose={() => setUpdateResult(null)}
          />
        )}
      </div>
    </>
  );
}

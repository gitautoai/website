"use client";
// Third party imports
import { useEffect, useState } from "react";

// Local imports (Relative paths)
import RepositorySelector from "../../settings/components/RepositorySelector";
import { usageJsonLd } from "./jsonld";
import { PullRequestStats } from "./types";

// Local imports
import { createCustomerPortalSession } from "@/app/actions/stripe/create-customer-portal-session";
import { getUsageStats } from "@/app/actions/supabase/get-usage-stats";
import { useAccountContext } from "@/app/components/contexts/Account";
import InfoIcon from "@/app/components/InfoIcon";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import PeriodSelector, { Period, calculatePeriodDates } from "@/app/components/PeriodSelector";
import SpinnerIcon from "@/app/components/SpinnerIcon";

const DEFAULT_PERIOD: Period = { type: "this-month", label: "This Month" };

export default function UsagePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, currentOwnerName, currentRepoName, currentStripeCustomerId } =
    useAccountContext();
  const [usageStats, setUsageStats] = useState<{
    all_time: PullRequestStats;
    selected_period: PullRequestStats;
  } | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(DEFAULT_PERIOD);

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

  useEffect(() => {
    const fetchData = async () => {
      if (!currentStripeCustomerId || !currentRepoName || !currentOwnerName || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        // Calculate selected period dates
        const { startDate, endDate } = calculatePeriodDates(selectedPeriod);

        // Both dates must be present
        if (!startDate || !endDate) {
          setIsLoading(false);
          return;
        }

        // Fetch stats for selected period
        const statsData = await getUsageStats({
          ownerName: currentOwnerName,
          repoName: currentRepoName,
          userId: userId,
          periodStart: startDate,
          periodEnd: endDate,
        });

        setUsageStats(statsData);
      } catch (error) {
        setError("Failed to load usage statistics");
        console.error("Error loading usage statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentStripeCustomerId, currentOwnerName, currentRepoName, userId, selectedPeriod]);

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

  const StatBlock = ({
    title,
    allTime,
    selectedPeriodValue,
    selectedPeriodLabel,
    showManageCredits,
    tooltip,
    showMergeRate,
    allTimeTotalPRs,
    selectedPeriodTotalPRs,
  }: {
    title: string;
    allTime: number;
    selectedPeriodValue: number;
    selectedPeriodLabel: string;
    showManageCredits?: boolean;
    tooltip?: string;
    showMergeRate?: boolean;
    allTimeTotalPRs?: number;
    selectedPeriodTotalPRs?: number;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {title}
        {tooltip && <InfoIcon tooltip={tooltip} />}
      </h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-600">All Time</p>
          <p className="text-2xl font-bold">
            {formatNumber(allTime)}
            {showMergeRate && allTimeTotalPRs !== undefined && (
              <span className="text-lg text-gray-600 ml-2">
                ({calculateMergeRate(allTime, allTimeTotalPRs)})
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{selectedPeriodLabel}</p>
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
        </div>
      </div>
    </div>
  );

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

        <p className="text-gray-600">
          {selectedPeriod.label}: {formatPeriodRange(selectedPeriod)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatBlock
            title="Total Pull Requests"
            allTime={usageStats?.all_time.total_prs || 0}
            selectedPeriodValue={usageStats?.selected_period.total_prs || 0}
            selectedPeriodLabel={selectedPeriod.label}
            tooltip="Number of pull requests generated by GitAuto for this repository."
          />
          <StatBlock
            title="Total Issues"
            allTime={usageStats?.all_time.total_issues || 0}
            selectedPeriodValue={usageStats?.selected_period.total_issues || 0}
            selectedPeriodLabel={selectedPeriod.label}
            showManageCredits={true}
            tooltip="Number of issues created by GitAuto for test generation requests."
          />
          <StatBlock
            title="Total Merged PRs"
            allTime={usageStats?.all_time.total_merges || 0}
            selectedPeriodValue={usageStats?.selected_period.total_merges || 0}
            selectedPeriodLabel={selectedPeriod.label}
            tooltip="Number of pull requests that were successfully merged into the repository. Merge rate percentage is calculated as (merged PRs / total PRs) × 100."
            showMergeRate={true}
            allTimeTotalPRs={usageStats?.all_time?.total_prs || 0}
            selectedPeriodTotalPRs={usageStats?.selected_period?.total_prs || 0}
          />
          <StatBlock
            title="Your Pull Requests"
            allTime={usageStats?.all_time.user_prs || 0}
            selectedPeriodValue={usageStats?.selected_period.user_prs || 0}
            selectedPeriodLabel={selectedPeriod.label}
            tooltip="Number of pull requests that you created using GitAuto on this repository."
          />
          <StatBlock
            title="Your Issues"
            allTime={usageStats?.all_time.user_issues || 0}
            selectedPeriodValue={usageStats?.selected_period.user_issues || 0}
            selectedPeriodLabel={selectedPeriod.label}
            tooltip="Number of issues that you created using GitAuto on this repository."
          />
          <StatBlock
            title="Your Merged PRs"
            allTime={usageStats?.all_time.user_merges || 0}
            selectedPeriodValue={usageStats?.selected_period.user_merges || 0}
            selectedPeriodLabel={selectedPeriod.label}
            tooltip="Number of pull requests that you created and were successfully merged into the repository. Your merge rate percentage is calculated as (your merged PRs / your total PRs) × 100."
            showMergeRate={true}
            allTimeTotalPRs={usageStats?.all_time?.user_prs || 0}
            selectedPeriodTotalPRs={usageStats?.selected_period?.user_prs || 0}
          />
        </div>

        {isLoading && <LoadingSpinner />}
      </div>
    </>
  );
}

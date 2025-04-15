"use client";
// Third party imports
import { useEffect, useState } from "react";

// Local imports
import { UsageStats, BillingPeriod } from "./types";
import RepositorySelector from "../../settings/components/RepositorySelector";
import { useAccountContext } from "@/components/Context/Account";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchWithTiming } from "@/utils/fetch";

export default function UsagePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentOwnerId, currentOwnerName, userId, currentInstallationId } = useAccountContext();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentOwnerId || !currentInstallationId) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        // Fetch billing period first
        const billingData = await fetchWithTiming<BillingPeriod>(`/api/stripe/get-billing-period`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerId: currentOwnerId }),
        });
        setBillingPeriod(billingData);

        // Then fetch stats with billing period
        const statsData = await fetchWithTiming<UsageStats>(`/api/supabase/get-usage-stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ownerName: currentOwnerName,
            userId: userId,
            periodStart: billingData.current_period_start,
            periodEnd: billingData.current_period_end,
          }),
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
  }, [currentOwnerId, userId, currentInstallationId]);

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatBlock = ({
    title,
    allTime,
    currentCycle,
  }: {
    title: string;
    allTime: number;
    currentCycle: number;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-600">All Time</p>
          <p className="text-2xl font-bold">{formatNumber(allTime)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Current Billing Cycle</p>
          <p className="text-2xl font-bold">{formatNumber(currentCycle)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Usage Statistics</h1>
      <RepositorySelector />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {usageStats && (
        <>
          <p className="text-gray-600">
            Current billing cycle: {formatDate(billingPeriod?.current_period_start || "")} -{" "}
            {formatDate(billingPeriod?.current_period_end || "")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatBlock
              title="Total Pull Requests"
              allTime={usageStats.all_time.total_prs}
              currentCycle={usageStats.current_cycle.total_prs}
            />
            <StatBlock
              title="Total Issues"
              allTime={usageStats.all_time.total_issues}
              currentCycle={usageStats.current_cycle.total_issues}
            />
            <StatBlock
              title="Total Merged PRs"
              allTime={usageStats.all_time.total_merges}
              currentCycle={usageStats.current_cycle.total_merges}
            />
            <StatBlock
              title="Your Pull Requests"
              allTime={usageStats.all_time.user_prs}
              currentCycle={usageStats.current_cycle.user_prs}
            />
            <StatBlock
              title="Your Issues"
              allTime={usageStats.all_time.user_issues}
              currentCycle={usageStats.current_cycle.user_issues}
            />
            <StatBlock
              title="Your Merged PRs"
              allTime={usageStats.all_time.user_merges}
              currentCycle={usageStats.current_cycle.user_merges}
            />
          </div>
        </>
      )}

      {isLoading && <LoadingSpinner />}
    </div>
  );
}

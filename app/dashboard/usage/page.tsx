"use client";
// Third party imports
import { useEffect, useState } from "react";

// Local imports
import { UsageStats, BillingPeriod } from "./types";
import RepositorySelector from "../../settings/components/RepositorySelector";
import { useAccountContext } from "@/components/Context/Account";
import LoadingSpinner from "@/components/LoadingSpinner";
import SpinnerIcon from "@/components/SpinnerIcon";
import { fetchWithTiming } from "@/utils/fetch";

export default function UsagePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, jwtToken, currentOwnerName, currentStripeCustomerId } = useAccountContext();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentStripeCustomerId) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        // Fetch billing period
        const billingData = await fetchWithTiming<BillingPeriod>(`/api/stripe/get-billing-period`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripe_customer_id: currentStripeCustomerId }),
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
  }, [currentStripeCustomerId]);

  const formatNumber = (value?: number) => {
    if (!value) return "-";
    return value.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleManageCredits = async () => {
    if (!currentStripeCustomerId) return;

    setIsPortalLoading(true);
    try {
      const portalUrl = await fetchWithTiming<string>("/api/stripe/create-portal-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          jwtToken,
          customerId: currentStripeCustomerId,
        }),
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
    currentCycle,
    limit,
    showManageCredits,
  }: {
    title: string;
    allTime: number;
    currentCycle: number;
    limit?: number;
    showManageCredits?: boolean;
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
          <p className="text-2xl font-bold">
            {formatNumber(currentCycle)}
            {limit !== undefined && ` / ${formatNumber(limit)}`}
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
    <div className="min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Usage Statistics</h1>
      <RepositorySelector />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <p className="text-gray-600">
        Current billing cycle: {formatDate(billingPeriod?.current_period_start || "")} -{" "}
        {formatDate(billingPeriod?.current_period_end || "")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatBlock
          title="Total Pull Requests"
          allTime={usageStats?.all_time.total_prs || 0}
          currentCycle={usageStats?.current_cycle.total_prs || 0}
        />
        <StatBlock
          title="Total Issues"
          allTime={usageStats?.all_time.total_issues || 0}
          currentCycle={usageStats?.current_cycle.total_issues || 0}
          limit={billingPeriod?.request_limit}
          showManageCredits={true}
        />
        <StatBlock
          title="Total Merged PRs"
          allTime={usageStats?.all_time.total_merges || 0}
          currentCycle={usageStats?.current_cycle.total_merges || 0}
        />
        <StatBlock
          title="Your Pull Requests"
          allTime={usageStats?.all_time.user_prs || 0}
          currentCycle={usageStats?.current_cycle.user_prs || 0}
        />
        <StatBlock
          title="Your Issues"
          allTime={usageStats?.all_time.user_issues || 0}
          currentCycle={usageStats?.current_cycle.user_issues || 0}
        />
        <StatBlock
          title="Your Merged PRs"
          allTime={usageStats?.all_time.user_merges || 0}
          currentCycle={usageStats?.current_cycle.user_merges || 0}
        />
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}

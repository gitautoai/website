"use client";
// Third party imports
import { useEffect, useState } from "react";

// Local imports (Relative paths)
import RepositorySelector from "../../settings/components/RepositorySelector";
import { usageJsonLd } from "./jsonld";
import { UsageStats } from "./types";

// Local imports
import { createCustomerPortalSession } from "@/app/actions/stripe/create-customer-portal-session";
import { useAccountContext } from "@/app/components/contexts/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SpinnerIcon from "@/app/components/SpinnerIcon";
import { fetchWithTiming } from "@/utils/fetch";

export default function UsagePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, currentOwnerName, currentStripeCustomerId } = useAccountContext();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
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

        // Calculate this month's period
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

        // Fetch stats for this month
        const statsData = await fetchWithTiming<UsageStats>(`/api/supabase/get-usage-stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ownerName: currentOwnerName,
            userId: userId,
            periodStart: thisMonthStart,
            periodEnd: nextMonthStart,
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
  }, [currentStripeCustomerId, currentOwnerName, userId]);

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
    thisMonth,
    showManageCredits,
  }: {
    title: string;
    allTime: number;
    thisMonth: number;
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
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold">{formatNumber(thisMonth)}</p>
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <p className="text-gray-600">
          This month:{" "}
          {formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())} -{" "}
          {formatDate(
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatBlock
            title="Total Pull Requests"
            allTime={usageStats?.all_time.total_prs || 0}
            thisMonth={usageStats?.this_month.total_prs || 0}
          />
          <StatBlock
            title="Total Issues"
            allTime={usageStats?.all_time.total_issues || 0}
            thisMonth={usageStats?.this_month.total_issues || 0}
            showManageCredits={true}
          />
          <StatBlock
            title="Total Merged PRs"
            allTime={usageStats?.all_time.total_merges || 0}
            thisMonth={usageStats?.this_month.total_merges || 0}
          />
          <StatBlock
            title="Your Pull Requests"
            allTime={usageStats?.all_time.user_prs || 0}
            thisMonth={usageStats?.this_month.user_prs || 0}
          />
          <StatBlock
            title="Your Issues"
            allTime={usageStats?.all_time.user_issues || 0}
            thisMonth={usageStats?.this_month.user_issues || 0}
          />
          <StatBlock
            title="Your Merged PRs"
            allTime={usageStats?.all_time.user_merges || 0}
            thisMonth={usageStats?.this_month.user_merges || 0}
          />
        </div>

        {isLoading && <LoadingSpinner />}
      </div>
    </>
  );
}

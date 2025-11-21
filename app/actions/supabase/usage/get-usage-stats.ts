"use server";

import { HistoricalStats } from "@/app/dashboard/usage/types";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function getUsageStats({
  ownerName,
  repoName,
  periodStart,
  periodEnd,
}: {
  ownerName: string;
  repoName: string;
  periodStart: string | null;
  periodEnd: string | null;
}) {
  console.log("getUsageStats params:", { ownerName, repoName, periodStart, periodEnd });

  // Get all usage data in a single query
  // Only select necessary columns to avoid transferring huge log fields
  const { data: allTimeData, error } = await supabaseAdmin
    .from("usage")
    .select("created_at, pr_number, owner_name, repo_name, issue_number, is_merged")
    .eq("owner_name", ownerName)
    .eq("repo_name", repoName);

  console.log("Supabase query result:", { dataLength: allTimeData?.length, error });

  if (error) {
    console.error("Supabase error fetching usage data:", error);
    throw new Error(`Failed to fetch usage data: ${error.message}`);
  }

  // Filter for selected period's data in memory
  // If periodStart and periodEnd are null, use all-time data
  const selectedPeriodData =
    periodStart && periodEnd
      ? allTimeData.filter((record) => {
          const createdAt = new Date(record.created_at);
          const start = new Date(periodStart);
          const end = new Date(periodEnd);
          return createdAt >= start && createdAt <= end;
        })
      : allTimeData;

  const calculateStats = (data: any[]): HistoricalStats => {
    // Get only the latest record for each PR number for merge status
    const sortedData = [...data].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const latestRecordsByPR = new Map<number, any>();
    for (const record of sortedData) {
      if (record.pr_number && !latestRecordsByPR.has(record.pr_number)) {
        latestRecordsByPR.set(record.pr_number, record);
      }
    }
    const latestPRRecords = Array.from(latestRecordsByPR.values());

    // Count unique PRs (deduplicate by PR number)
    const uniquePRs = new Set(
      data
        .filter((record) => record.pr_number)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );

    // Unique issue count is owner_name + repo_name + issue_number combination
    const uniqueIssues = new Set(
      data.map((record) => `${record.owner_name}/${record.repo_name}#${record.issue_number}`)
    );

    // Track unique merged PRs (deduplicate by PR number) - use latest records only
    const uniqueMergedPRs = new Set(
      latestPRRecords
        .filter((record) => record.is_merged && record.pr_number)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );

    return {
      total_issues: uniqueIssues.size,
      total_prs: uniquePRs.size,
      total_merges: uniqueMergedPRs.size,
    };
  };

  return {
    all_time: calculateStats(allTimeData || []),
    selected_period: calculateStats(selectedPeriodData),
  };
}

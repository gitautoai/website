"use server";

import { HistoricalStats } from "@/app/dashboard/usage/types";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function getUsageStats({
  ownerName,
  repoName,
  userId,
  periodStart,
  periodEnd,
}: {
  ownerName: string;
  repoName: string;
  userId: number;
  periodStart: string;
  periodEnd: string;
}) {
  // Get all usage data in a single query
  const { data: allTimeData, error } = await supabaseAdmin
    .from("usage")
    .select("*")
    .eq("owner_name", ownerName)
    .eq("repo_name", repoName);

  if (error) throw new Error("Failed to fetch usage data");

  // Filter for selected period's data in memory
  const selectedPeriodData = allTimeData.filter((record) => {
    const createdAt = new Date(record.created_at);
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    return createdAt >= start && createdAt <= end;
  });

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
    const userUniquePRs = new Set(
      data
        .filter((record) => record.pr_number && record.user_id === userId)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );

    // Unique issue count is owner_name + repo_name + issue_number combination
    const uniqueIssues = new Set(
      data.map((record) => `${record.owner_name}/${record.repo_name}#${record.issue_number}`)
    );
    const userUniqueIssues = new Set(
      data
        .filter((record) => record.user_id === userId)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.issue_number}`)
    );

    // Track unique merged PRs (deduplicate by PR number) - use latest records only
    const uniqueMergedPRs = new Set(
      latestPRRecords
        .filter((record) => record.is_merged && record.pr_number)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );
    const userUniqueMergedPRs = new Set(
      latestPRRecords
        .filter((record) => record.is_merged && record.pr_number && record.user_id === userId)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );

    return {
      total_issues: uniqueIssues.size,
      total_prs: uniquePRs.size,
      total_merges: uniqueMergedPRs.size,
      user_issues: userUniqueIssues.size,
      user_prs: userUniquePRs.size,
      user_merges: userUniqueMergedPRs.size,
    };
  };

  return {
    all_time: calculateStats(allTimeData || []),
    selected_period: calculateStats(selectedPeriodData),
  };
}

"use server";

import { PullRequestStats } from "@/app/dashboard/usage/types";
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

  const calculateStats = (data: any[]): PullRequestStats => {
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

    // Track unique merged PRs (deduplicate by PR number)
    const uniqueMergedPRs = new Set(
      data
        .filter((record) => record.is_merged && record.pr_number)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );
    const userUniqueMergedPRs = new Set(
      data
        .filter((record) => record.is_merged && record.pr_number && record.user_id === userId)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );

    // Track unique open PRs (not merged, deduplicate by PR number)
    const uniqueOpenPRs = new Set(
      data
        .filter((record) => !record.is_merged && record.pr_number)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );
    const userUniqueOpenPRs = new Set(
      data
        .filter((record) => !record.is_merged && record.pr_number && record.user_id === userId)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );

    // Track unique passing PRs (open and test passed, deduplicate by PR number)
    const uniquePassingPRs = new Set(
      data
        .filter((record) => !record.is_merged && record.is_test_passed && record.pr_number)
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );
    const userUniquePassingPRs = new Set(
      data
        .filter(
          (record) =>
            !record.is_merged &&
            record.is_test_passed &&
            record.pr_number &&
            record.user_id === userId
        )
        .map((record) => `${record.owner_name}/${record.repo_name}#${record.pr_number}`)
    );

    return {
      total_issues: uniqueIssues.size,
      total_open_prs: uniqueOpenPRs.size,
      total_passing_prs: uniquePassingPRs.size,
      total_prs: uniquePRs.size,
      total_merges: uniqueMergedPRs.size,
      user_issues: userUniqueIssues.size,
      user_open_prs: userUniqueOpenPRs.size,
      user_passing_prs: userUniquePassingPRs.size,
      user_prs: userUniquePRs.size,
      user_merges: userUniqueMergedPRs.size,
    };
  };

  return {
    all_time: calculateStats(allTimeData || []),
    selected_period: calculateStats(selectedPeriodData),
  };
}

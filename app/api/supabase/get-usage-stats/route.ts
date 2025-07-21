import { NextResponse } from "next/server";

import { PullRequestStats } from "@/app/dashboard/usage/types";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { ownerName, userId, periodStart, periodEnd } = await request.json();
    console.log({ ownerName, userId, periodStart, periodEnd });

    if (!ownerName) return NextResponse.json({ error: "Owner name is required" }, { status: 400 });
    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    if (!periodStart || !periodEnd)
      return NextResponse.json({ error: "Period is required" }, { status: 400 });

    // Get all-time stats
    const { data: allTimeData, error: allTimeError } = await supabaseAdmin
      .from("usage_with_issues")
      .select("*")
      .eq("owner_name", ownerName);

    if (allTimeError)
      return NextResponse.json({ error: "Failed to fetch all-time data" }, { status: 500 });

    console.log("allTimeData.length: ", allTimeData.length);

    // Get this month stats
    const { data: thisMonthData, error: thisMonthError } = await supabaseAdmin
      .from("usage_with_issues")
      .select("*")
      .eq("owner_name", ownerName)
      .gte("created_at", periodStart)
      .lte("created_at", periodEnd);

    if (thisMonthError)
      return NextResponse.json({ error: "Failed to fetch this month data" }, { status: 500 });

    console.log("thisMonthData.length: ", thisMonthData.length);

    const calculateStats = (data: any[]): PullRequestStats => {
      // PR count is the number of records in the usage table
      const totalPRs = data.length;
      const userPRs = data.filter((record) => record.user_id === userId).length;
      console.log({ totalPRs, userPRs });

      // Unique issue count is owner_name + repo_name + issue_number combination
      const uniqueIssues = new Set(
        data.map((record) => `${record.owner_name}/${record.repo_name}#${record.issue_number}`)
      );
      const userUniqueIssues = new Set(
        data
          .filter((record) => record.user_id === userId)
          .map((record) => `${record.owner_name}/${record.repo_name}#${record.issue_number}`)
      );
      console.log("uniqueIssues.size: ", uniqueIssues.size);
      console.log("userUniqueIssues.size: ", userUniqueIssues.size);

      // Track merged issues
      const mergedIssues = new Set(
        data
          .filter((record) => record.merged)
          .map((record) => `${record.owner_name}/${record.repo_name}#${record.issue_number}`)
      );
      const userMergedIssues = new Set(
        data
          .filter((record) => record.merged && record.user_id === userId)
          .map((record) => `${record.owner_name}/${record.repo_name}#${record.issue_number}`)
      );
      console.log("mergedIssues.size: ", mergedIssues.size);
      console.log("userMergedIssues.size: ", userMergedIssues.size);

      return {
        total_prs: totalPRs,
        user_prs: userPRs,
        total_issues: uniqueIssues.size,
        user_issues: userUniqueIssues.size,
        total_merges: mergedIssues.size,
        user_merges: userMergedIssues.size,
      };
    };

    return NextResponse.json({
      all_time: calculateStats(allTimeData || []),
      this_month: calculateStats(thisMonthData),
    });
  } catch (error) {
    console.error("Error in get-github-stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

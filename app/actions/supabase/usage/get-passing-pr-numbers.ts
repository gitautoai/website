"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const getPassingPRNumbers = async ({
  ownerName,
  repoName,
  openPRNumbers,
  userId,
}: {
  ownerName: string;
  repoName: string;
  openPRNumbers: number[];
  userId: number;
}) => {
  const { data, error } = await supabaseAdmin
    .from("usage")
    .select("pr_number, is_test_passed, is_merged, user_id, created_at")
    .eq("owner_name", ownerName)
    .eq("repo_name", repoName)
    .eq("is_merged", false)
    .in("pr_number", openPRNumbers)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch passing PR stats");

  // Filter only records that match the actual open PRs from GitHub
  const validRecords = data.filter(
    (r) => r.pr_number !== null && openPRNumbers.includes(r.pr_number)
  );

  // Get only the latest record for each PR number
  const latestRecordsByPR = new Map<number, (typeof validRecords)[0]>();
  for (const record of validRecords) {
    if (record.pr_number && !latestRecordsByPR.has(record.pr_number)) {
      latestRecordsByPR.set(record.pr_number, record);
    }
  }
  const latestRecords = Array.from(latestRecordsByPR.values());

  // Count passing PRs (open + not merged + test passed) using only latest records
  const passingPRs = new Set(latestRecords.filter((r) => r.is_test_passed).map((r) => r.pr_number));

  // Count user's open PRs using only latest records
  const userOpenPRs = new Set(
    latestRecords.filter((r) => r.user_id === userId).map((r) => r.pr_number)
  );

  // Count user's passing PRs using only latest records
  const userPassingPRs = new Set(
    latestRecords.filter((r) => r.user_id === userId && r.is_test_passed).map((r) => r.pr_number)
  );

  return {
    totalPassing: passingPRs.size,
    userOpen: userOpenPRs.size,
    userPassing: userPassingPRs.size,
  };
};

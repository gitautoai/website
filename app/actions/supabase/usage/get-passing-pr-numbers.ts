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
    .select("pr_number, is_test_passed, is_merged, user_id")
    .eq("owner_name", ownerName)
    .eq("repo_name", repoName)
    .eq("is_merged", false)
    .in("pr_number", openPRNumbers);

  if (error) throw new Error("Failed to fetch passing PR stats");

  // Filter only records that match the actual open PRs from GitHub
  const validRecords = data.filter((r) => r.pr_number !== null && openPRNumbers.includes(r.pr_number));

  // Count passing PRs (open + not merged + test passed)
  const passingPRs = new Set(validRecords.filter((r) => r.is_test_passed).map((r) => r.pr_number));

  // Count user's open PRs
  const userOpenPRs = new Set(
    validRecords.filter((r) => r.user_id === userId).map((r) => r.pr_number)
  );

  // Count user's passing PRs
  const userPassingPRs = new Set(
    validRecords.filter((r) => r.user_id === userId && r.is_test_passed).map((r) => r.pr_number)
  );

  return {
    totalPassing: passingPRs.size,
    userOpen: userOpenPRs.size,
    userPassing: userPassingPRs.size,
  };
};

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const getOpenPRStats = async ({
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
    .select("pr_number, is_test_passed, user_id")
    .eq("owner_name", ownerName)
    .eq("repo_name", repoName)
    .in("pr_number", openPRNumbers);

  if (error) throw new Error("Failed to fetch open PR stats");

  // Count passing PRs
  const passingPRs = new Set(data.filter((r) => r.is_test_passed).map((r) => r.pr_number));

  // Count user's open PRs
  const userOpenPRs = new Set(data.filter((r) => r.user_id === userId).map((r) => r.pr_number));

  // Count user's passing PRs
  const userPassingPRs = new Set(
    data.filter((r) => r.user_id === userId && r.is_test_passed).map((r) => r.pr_number)
  );

  return {
    totalOpen: openPRNumbers.length,
    totalPassing: passingPRs.size,
    userOpen: userOpenPRs.size,
    userPassing: userPassingPRs.size,
  };
};

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

const FOXQUILT_OWNER_NAME = "Foxquilt";

export type HomeStats = {
  totalRepos: number;
  totalPrsCreated: number;
  testPassRate: number | null;
  mergeRate: number | null;
};

export async function getHomeStats(): Promise<HomeStats> {
  // Get total repos connected
  const { count: totalRepos, error: repoError } = await supabaseAdmin
    .from("repositories")
    .select("*", { count: "exact", head: true });

  if (repoError) throw new Error(`Failed to fetch repos: ${repoError.message}`);

  // Get total unique PRs across all customers
  const { data: allPrs, error: allError } = await supabaseAdmin
    .from("usage")
    .select("owner_name, repo_name, pr_number")
    .not("pr_number", "is", null)
    .gt("pr_number", 0);

  if (allError) throw new Error(`Failed to fetch total PRs: ${allError.message}`);

  const uniqueAllPrs = new Set(
    allPrs.map((r) => `${r.owner_name}/${r.repo_name}#${r.pr_number}`),
  );

  // Get Foxquilt PRs for pass/merge rates
  const { data: foxPrs, error: foxError } = await supabaseAdmin
    .from("usage")
    .select("repo_name, pr_number, is_test_passed, is_merged")
    .eq("owner_name", FOXQUILT_OWNER_NAME)
    .not("pr_number", "is", null)
    .gt("pr_number", 0);

  if (foxError) throw new Error(`Failed to fetch Foxquilt PRs: ${foxError.message}`);

  // Deduplicate: a PR is "passed" if ANY row has is_test_passed or is_merged
  // A PR is "merged" if ANY row has is_merged
  const foxPrMap = new Map<string, { passed: boolean; merged: boolean }>();
  for (const r of foxPrs) {
    const key = `${r.repo_name}#${r.pr_number}`;
    const existing = foxPrMap.get(key);
    if (existing) {
      if (r.is_test_passed || r.is_merged) existing.passed = true;
      if (r.is_merged) existing.merged = true;
    } else {
      foxPrMap.set(key, {
        passed: r.is_test_passed || r.is_merged,
        merged: r.is_merged,
      });
    }
  }

  const foxTotal = foxPrMap.size;
  let foxPassed = 0;
  let foxMerged = 0;
  foxPrMap.forEach(({ passed, merged }) => {
    if (passed) foxPassed++;
    if (merged) foxMerged++;
  });

  return {
    totalRepos: totalRepos || 0,
    totalPrsCreated: uniqueAllPrs.size,
    testPassRate: foxTotal > 0 ? Math.round((foxPassed / foxTotal) * 1000) / 10 : null,
    mergeRate: foxTotal > 0 ? Math.round((foxMerged / foxTotal) * 1000) / 10 : null,
  };
}

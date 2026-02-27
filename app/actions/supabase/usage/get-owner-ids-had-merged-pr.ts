"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/** Returns a Map of owner_id → merged PR count for owners with at least one merged PR. */
export const getOwnerIdsHadMergedPr = async (ownerIds: number[]) => {
  if (ownerIds.length === 0) return new Map<number, number>();

  const { data, error } = await supabaseAdmin
    .from("usage")
    .select("owner_id")
    .in("owner_id", ownerIds)
    .not("pr_number", "is", null)
    .gt("pr_number", 0)
    .eq("is_merged", true);

  if (error) {
    console.error("Failed to fetch owner IDs with merged PRs:", error.message);
    throw new Error(`Failed to fetch owner IDs with merged PRs: ${error.message}`);
  }

  const counts = new Map<number, number>();
  for (const r of data || []) {
    counts.set(r.owner_id, (counts.get(r.owner_id) || 0) + 1);
  }
  return counts;
};

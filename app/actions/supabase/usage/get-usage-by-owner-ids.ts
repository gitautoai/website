"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/** Fetch all usage rows that have PR numbers for given owner IDs. */
export const getUsageByOwnerIds = async (ownerIds: number[]) => {
  if (ownerIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from("usage")
    .select("owner_id, trigger, owner_name, repo_name, pr_number, is_merged, created_at")
    .in("owner_id", ownerIds)
    .not("pr_number", "is", null)
    .gt("pr_number", 0);

  if (error) {
    console.error("Failed to fetch usage:", error.message);
    throw new Error(`Failed to fetch usage: ${error.message}`);
  }

  return data || [];
};

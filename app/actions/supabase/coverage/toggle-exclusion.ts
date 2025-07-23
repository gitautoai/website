"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Toggle exclusion status for coverage files
 */
export async function toggleExclusion(
  ids: number[],
  isExcluded: boolean,
  userId: number,
  userName: string
) {
  if (ids.length === 0) return 0;

  const { error } = await supabaseAdmin
    .from("coverages")
    .update({
      is_excluded_from_testing: isExcluded,
      updated_by: `${userId}:${userName}`,
    })
    .in("id", ids);

  if (error) {
    console.error("Error toggling exclusion:", error);
    throw error;
  }

  return ids.length;
}

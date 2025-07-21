"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Delete coverage files by IDs
 */
export async function deleteCoverage(ids: number[]) {
  if (ids.length === 0) return 0;

  const { error } = await supabaseAdmin.from("coverages").delete().in("id", ids);

  if (error) {
    console.error("Error deleting files:", error);
    throw error;
  }

  return ids.length;
}

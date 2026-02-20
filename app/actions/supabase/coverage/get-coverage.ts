"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Get existing coverage data from Supabase
 */
export async function getCoverage(ownerId: number, repoId: number) {
  const { data, error } = await supabaseAdmin
    .from("coverages")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("repo_id", repoId);

  if (error) {
    console.error("Error fetching coverage data:", error);
    throw error;
  }

  if (!data) return [];

  return data;
}

"use server";

import { CoverageData } from "@/app/dashboard/coverage/types";
import { supabase } from "@/lib/supabase";

/**
 * Get existing coverage data from Supabase
 */
export async function getCoverage(ownerId: number, repoId: number) {
  const { data, error } = await supabase
    .from("coverages")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("repo_id", repoId);

  if (error) {
    console.error("Error fetching coverage data:", error);
    throw error;
  }

  return data as CoverageData[];
}

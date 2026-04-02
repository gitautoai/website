"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Get clone progress for an owner: how many repos have been processed (have file_count)
 * vs total repos in the DB. Used to show "Processing repos: X/Y complete" on coverage page.
 */
export async function getCloneProgress(ownerId: number) {
  const { data, error } = await supabaseAdmin
    .from("repositories")
    .select("repo_name, file_count")
    .eq("owner_id", ownerId);

  if (error || !data) {
    console.error("Failed to get clone progress:", error);
    return null;
  }

  const total = data.length;
  const cloned = data.filter((r) => r.file_count !== null).length;
  const pending = data
    .filter((r) => r.file_count === null)
    .map((r) => r.repo_name);

  return { total, cloned, pending };
}

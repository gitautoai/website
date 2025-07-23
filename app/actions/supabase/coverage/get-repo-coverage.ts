"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { Tables } from "@/types/supabase";

export async function getRepoCoverage(ownerId: number, repoId: number) {
  const { data, error } = await supabaseAdmin
    .from("repo_coverage")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("repo_id", repoId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching repo coverage data:", error);
    throw error;
  }

  return data as Tables<"repo_coverage">[];
}

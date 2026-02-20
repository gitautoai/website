"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { Tables } from "@/types/supabase";

export const getRepoCoverage = async (
  ownerId: number,
  repoId: number
): Promise<Tables<"repo_coverage">[]> => {
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

  return data || [];
};

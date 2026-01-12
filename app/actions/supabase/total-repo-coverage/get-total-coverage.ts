"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { Tables } from "@/types/supabase";

export const getTotalCoverage = async (
  ownerId: number
): Promise<Tables<"total_repo_coverage">[]> => {
  const { data, error } = await supabaseAdmin
    .from("total_repo_coverage")
    .select("*")
    .eq("owner_id", ownerId)
    .order("coverage_date", { ascending: true });

  if (error) throw new Error(error.message);

  return data || [];
};

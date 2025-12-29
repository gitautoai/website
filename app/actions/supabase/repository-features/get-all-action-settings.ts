"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const getAllActionSettings = async (ownerId: number) => {
  if (!ownerId) throw new Error("Missing required parameter: ownerId");

  const { data: settings, error } = await supabaseAdmin
    .from("repository_features")
    .select("*")
    .eq("owner_id", ownerId)
    .order("repo_name");

  if (error) throw error;

  return settings || [];
};

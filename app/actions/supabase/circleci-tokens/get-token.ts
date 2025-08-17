"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const getCircleCIToken = async (ownerId: number) => {
  if (!ownerId) return null;

  const { data } = await supabaseAdmin
    .from("circleci_tokens")
    .select("*")
    .eq("owner_id", ownerId)
    .single();

  return data;
};

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const getNpmToken = async (ownerId: number) => {
  if (!ownerId) return null;

  const { data } = await supabaseAdmin
    .from("npm_tokens")
    .select("*")
    .eq("owner_id", ownerId)
    .single();

  return data;
};

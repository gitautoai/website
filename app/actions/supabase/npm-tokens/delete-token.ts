"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const deleteNpmToken = async (ownerId: number) => {
  if (!ownerId) throw new Error("Owner ID is required");

  const { error } = await supabaseAdmin.from("npm_tokens").delete().eq("owner_id", ownerId);

  if (error) throw error;
};

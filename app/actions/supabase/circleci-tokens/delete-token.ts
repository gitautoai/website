"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const deleteCircleCIToken = async (ownerId: number) => {
  if (!ownerId) return;

  const { error } = await supabaseAdmin.from("circleci_tokens").delete().eq("owner_id", ownerId);

  if (error) throw error;
};

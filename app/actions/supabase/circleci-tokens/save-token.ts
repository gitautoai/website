"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export const saveCircleCIToken = async (
  ownerId: number,
  token: string,
  userId: number,
  userName: string
) => {
  if (!ownerId || !token || !userId) throw new Error("Missing required parameters");

  const userIdAndName = `${userId}:${userName}`;

  const tokenData: Database["public"]["Tables"]["circleci_tokens"]["Insert"] = {
    owner_id: ownerId,
    token: token.trim(),
    created_by: userIdAndName,
    updated_by: userIdAndName,
  };

  const { data, error } = await supabaseAdmin
    .from("circleci_tokens")
    .upsert(tokenData, {
      onConflict: "owner_id",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

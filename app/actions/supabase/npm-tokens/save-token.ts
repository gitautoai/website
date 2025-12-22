"use server";

import { verifyNpmToken } from "@/app/actions/npm/verify-token";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export const saveNpmToken = async (
  ownerId: number,
  token: string,
  userId: number,
  userName: string
) => {
  if (!ownerId || !token || !userId) throw new Error("Missing required parameters");

  // Verify token is valid before saving
  const verification = await verifyNpmToken(token.trim());
  if (!verification.valid)
    throw new Error(
      verification.error || "Invalid npm token. Please check your token and try again."
    );

  const userIdAndName = `${userId}:${userName}`;

  const tokenData: Database["public"]["Tables"]["npm_tokens"]["Insert"] = {
    owner_id: ownerId,
    token: token.trim(),
    created_by: userIdAndName,
    updated_by: userIdAndName,
  };

  const { data, error } = await supabaseAdmin
    .from("npm_tokens")
    .upsert(tokenData, {
      onConflict: "owner_id",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

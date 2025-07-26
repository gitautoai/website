"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getUser(userId: number) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Get user error:", error);
    return null;
  }

  return data;
}

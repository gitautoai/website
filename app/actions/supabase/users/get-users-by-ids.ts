"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/** Fetch users by IDs, excluding null emails and those who opted out of drip emails. */
export const getUsersByIds = async (userIds: number[]) => {
  if (userIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("user_id, email, user_name, display_name, display_name_override")
    .in("user_id", userIds)
    .not("email", "is", null)
    .eq("skip_drip_emails", false);

  if (error) {
    console.error("Failed to fetch users:", error.message);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data || [];
};

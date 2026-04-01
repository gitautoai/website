"use server";

import { slackUs } from "@/app/actions/slack/slack-us";
import { supabaseAdmin } from "@/lib/supabase/server";
import { TablesInsert } from "@/types/supabase";

// Cross-ref: gitauto/services/supabase/users/upsert_user.py
export async function upsertUser(
  userId: number,
  userName: string,
  displayName: string,
  email: string | null,
) {
  try {
    const upsertData: TablesInsert<"users"> = {
      user_id: userId,
      user_name: userName,
      display_name: displayName,
      email,
      created_by: userName,
    };

    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert(upsertData, {
        onConflict: "user_id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: "User upserted successfully",
      data,
    };
  } catch (error) {
    console.error("User upsert error:", error);
    await slackUs(
      `❌ User upsert error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      success: false,
      message: "Failed to upsert user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

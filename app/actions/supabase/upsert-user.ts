"use server";

import { supabase } from "@/lib/supabase";
import { TablesInsert } from "@/types/supabase";

export async function upsertUser(userId: number, userName: string, email: string | null) {
  try {
    const upsertData: TablesInsert<"users"> = {
      user_id: userId,
      user_name: userName,
      email,
      created_by: userName,
    };

    const { data, error } = await supabase
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
    return {
      success: false,
      message: "Failed to upsert user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

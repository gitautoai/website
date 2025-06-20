"use server";

import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

export async function getUser(userId: number) {
  try {
    const { data, error } = await supabase.from("users").select("user_id").eq("user_id", userId);

    if (error) throw error;

    return {
      success: true,
      exists: data.length > 0,
      data: data[0] as Pick<Tables<"users">, "user_id"> | undefined,
    };
  } catch (error) {
    console.error("Get user error:", error);
    return {
      success: false,
      exists: false,
      data: undefined as Pick<Tables<"users">, "user_id"> | undefined,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

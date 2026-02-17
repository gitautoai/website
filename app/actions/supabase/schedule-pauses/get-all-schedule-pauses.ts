"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export type SchedulePause = Tables<"schedule_pauses">;

export const getAllSchedulePauses = async (ownerId: number) => {
  if (!ownerId) throw new Error("Missing required parameter: ownerId");

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabaseAdmin
    .from("schedule_pauses")
    .select("*")
    .eq("owner_id", ownerId)
    .gte("pause_end", today)
    .order("pause_start", { ascending: true });

  if (error) throw error;
  return data || [];
};

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const deleteSchedulePause = async (pauseId: string) => {
  if (!pauseId) throw new Error("Missing required parameter: pauseId");

  const { error } = await supabaseAdmin
    .from("schedule_pauses")
    .delete()
    .eq("id", pauseId);

  if (error) throw error;
};

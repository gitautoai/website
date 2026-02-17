"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const addSchedulePause = async (
  ownerId: number,
  repoId: number,
  pauseStart: string,
  pauseEnd: string,
  userIdentifier: string,
  reason?: string,
) => {
  if (!ownerId || !repoId) throw new Error("Missing required parameters");
  if (!pauseStart || !pauseEnd) throw new Error("Missing date range");
  if (pauseEnd < pauseStart) throw new Error("End date must be on or after start date");

  const { data, error } = await supabaseAdmin
    .from("schedule_pauses")
    .insert({
      owner_id: ownerId,
      repo_id: repoId,
      pause_start: pauseStart,
      pause_end: pauseEnd,
      reason: reason || null,
      created_by: userIdentifier,
      updated_by: userIdentifier,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

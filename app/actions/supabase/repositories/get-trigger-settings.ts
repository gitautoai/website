"use server";

import type { TriggerSettings } from "@/app/settings/types";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export async function getTriggerSettings(
  ownerId: number,
  repoId: number
): Promise<TriggerSettings> {
  if (!ownerId || !repoId) throw new Error("Missing required parameters");

  const { data: settings, error: settingsError } = await supabaseAdmin
    .from("repositories")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("repo_id", repoId)
    .maybeSingle();

  if (settingsError) throw settingsError;

  if (!settings) {
    return {
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnSchedule: true,
      scheduleTimeLocal: "09:00",
      scheduleTimeUTC: "",
      scheduleIncludeWeekends: false,
      scheduleExecutionCount: 1,
      scheduleIntervalMinutes: 15,
    };
  }

  // Type the settings properly
  const repo: Tables<"repositories"> = settings;

  let scheduleTimeUTC = "";
  if (repo.schedule_time) {
    const timeParts = repo.schedule_time.split(":");
    const utcHours = parseInt(timeParts[0], 10);
    const utcMinutes = parseInt(timeParts[1], 10);
    scheduleTimeUTC = `${utcHours.toString().padStart(2, "0")}:${utcMinutes.toString().padStart(2, "0")}`;
  }

  return {
    triggerOnReviewComment: repo.trigger_on_review_comment,
    triggerOnTestFailure: repo.trigger_on_test_failure,
    triggerOnSchedule: repo.trigger_on_schedule,
    scheduleTimeLocal: "",
    scheduleTimeUTC,
    scheduleIncludeWeekends: repo.schedule_include_weekends,
    scheduleExecutionCount: repo.schedule_execution_count,
    scheduleIntervalMinutes: repo.schedule_interval_minutes,
  };
}

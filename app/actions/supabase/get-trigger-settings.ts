"use server";

import { supabase } from "@/lib/supabase";
import type { TriggerSettings } from "@/app/settings/types";

export async function getTriggerSettings(
  ownerId: number,
  repoId: number
): Promise<TriggerSettings> {
  if (!ownerId || !repoId) throw new Error("Missing required parameters");

  const { data: settings, error: settingsError } = await supabase
    .from("repositories")
    .select(
      `
      trigger_on_review_comment,
      trigger_on_test_failure,
      trigger_on_commit,
      trigger_on_pr_change,
      trigger_on_merged,
      trigger_on_schedule,
      schedule_frequency,
      schedule_time,
      schedule_include_weekends
    `
    )
    .eq("owner_id", ownerId)
    .eq("repo_id", repoId)
    .maybeSingle();

  if (!settings) {
    return {
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnCommit: false,
      triggerOnPrChange: false,
      triggerOnMerged: false,
      triggerOnSchedule: false,
      scheduleTimeLocal: "09:00",
      scheduleTimeUTC: "",
      scheduleIncludeWeekends: false,
    };
  }

  if (settingsError) throw settingsError;

  // Get UTC time from DB
  let scheduleTimeUTC = "";
  if (settings.schedule_time) {
    const timeParts = settings.schedule_time.split(":");
    const utcHours = parseInt(timeParts[0], 10);
    const utcMinutes = parseInt(timeParts[1], 10);
    scheduleTimeUTC = `${utcHours.toString().padStart(2, "0")}:${utcMinutes.toString().padStart(2, "0")}`;
  }

  return {
    triggerOnReviewComment: settings.trigger_on_review_comment || false,
    triggerOnTestFailure: settings.trigger_on_test_failure || false,
    triggerOnCommit: settings.trigger_on_commit || false,
    triggerOnPrChange: settings.trigger_on_pr_change || false,
    triggerOnMerged: settings.trigger_on_merged || false,
    triggerOnSchedule: settings.trigger_on_schedule || false,
    scheduleTimeLocal: "", // Calculate on the client side
    scheduleTimeUTC,
    scheduleIncludeWeekends: settings.schedule_include_weekends || false,
  };
}

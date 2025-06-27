"use server";

import { supabase } from "@/lib/supabase";
import type { TriggerSettings } from "@/app/settings/types";

export async function saveTriggerSettings(
  ownerId: number,
  repoId: number,
  repoName: string,
  userId: number,
  userName: string,
  settings: TriggerSettings
): Promise<void> {
  const missingParams = [];
  if (!ownerId) missingParams.push("ownerId");
  if (!repoId) missingParams.push("repoId");
  if (!repoName) missingParams.push("repoName");
  if (!userId) missingParams.push("userId");

  if (missingParams.length > 0)
    throw new Error(`Missing required parameters: ${missingParams.join(", ")}`);

  const { data: existingRepo } = await supabase
    .from("repositories")
    .select("repo_id")
    .match({ owner_id: ownerId, repo_id: repoId })
    .maybeSingle();

  // Update data structure
  const updateData = {
    updated_by: userId.toString() + ":" + userName,
    trigger_on_review_comment: settings.triggerOnReviewComment,
    trigger_on_test_failure: settings.triggerOnTestFailure,
    trigger_on_commit: settings.triggerOnCommit,
    trigger_on_pr_change: settings.triggerOnPrChange,
    trigger_on_merged: settings.triggerOnMerged,
    trigger_on_schedule: settings.triggerOnSchedule,
    schedule_frequency: settings.triggerOnSchedule ? "daily" : null,
    schedule_time:
      settings.triggerOnSchedule && settings.scheduleTimeUTC
        ? `${settings.scheduleTimeUTC}:00+00` // "22:00" → "22:00:00+00"
        : null,
    schedule_include_weekends: settings.scheduleIncludeWeekends,
  };

  if (existingRepo) {
    const { error } = await supabase
      .from("repositories")
      .update(updateData)
      .match({ owner_id: ownerId, repo_id: repoId });

    if (error) throw error;
  } else {
    const insertData = {
      owner_id: ownerId,
      repo_id: repoId,
      repo_name: repoName,
      created_by: userId.toString() + ":" + userName,
      ...updateData,

      // Default values for other required fields
      repo_rules: "",
      target_branch: "",
      use_screenshots: false,
      production_url: "",
      local_port: 8080,
      startup_commands: [],
      web_urls: [],
      file_paths: [],
    };

    const { error } = await supabase.from("repositories").insert(insertData);

    if (error) throw error;
  }
}

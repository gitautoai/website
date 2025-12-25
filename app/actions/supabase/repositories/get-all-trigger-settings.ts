"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export type TriggerSettingsForRepo = {
  repo_id: number;
  trigger_on_review_comment: boolean;
  trigger_on_test_failure: boolean;
  trigger_on_schedule: boolean;
  schedule_time: string | null;
  schedule_include_weekends: boolean;
  schedule_execution_count: number;
  schedule_interval_minutes: number;
  updated_by: string;
  updated_at: string;
};

export async function getAllTriggerSettings(ownerId: number): Promise<TriggerSettingsForRepo[]> {
  if (!ownerId) throw new Error("Missing required parameter: ownerId");

  const { data: repositories, error } = await supabaseAdmin
    .from("repositories")
    .select(
      "repo_id, trigger_on_review_comment, trigger_on_test_failure, trigger_on_schedule, schedule_time, schedule_include_weekends, schedule_execution_count, schedule_interval_minutes, updated_by, updated_at"
    )
    .eq("owner_id", ownerId);

  if (error) throw error;

  if (!repositories) return [];

  return repositories.map((repo) => ({
    repo_id: repo.repo_id,
    trigger_on_review_comment: repo.trigger_on_review_comment,
    trigger_on_test_failure: repo.trigger_on_test_failure,
    trigger_on_schedule: repo.trigger_on_schedule,
    schedule_time: repo.schedule_time,
    schedule_include_weekends: repo.schedule_include_weekends,
    schedule_execution_count: repo.schedule_execution_count,
    schedule_interval_minutes: repo.schedule_interval_minutes,
    updated_by: repo.updated_by,
    updated_at: repo.updated_at,
  }));
}

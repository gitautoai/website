import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const startTime = performance.now();
  try {
    const {
      ownerId,
      repoId,
      repoName,
      userId,
      userName,
      triggerOnReviewComment,
      triggerOnTestFailure,
      triggerOnCommit,
      triggerOnMerged,
      triggerOnSchedule,
      scheduleFrequency,
      scheduleTime,
      scheduleIncludeWeekends,
    } = await request.json();

    const missingParams = [];
    if (!ownerId) missingParams.push("ownerId");
    if (!repoId) missingParams.push("repoId");
    if (!repoName) missingParams.push("repoName");
    if (!userId) missingParams.push("userId");

    if (missingParams.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required parameters: ${missingParams.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check if the repository record exists
    const { data: existingRepo } = await supabase
      .from("repositories")
      .select("repo_id")
      .match({ owner_id: ownerId, repo_id: repoId })
      .maybeSingle();

    // Update the time conversion logic in saveSettings API
    let scheduleTimeObj = null;
    if (triggerOnSchedule && scheduleTime) {
      // Parse the local time from HH:MM format
      const [localHours, localMinutes] = scheduleTime.split(":").map(Number);

      // Create a Date object with the local time
      const localTime = new Date();
      localTime.setHours(localHours, localMinutes, 0, 0);

      // Convert to UTC
      const utcHours = localTime.getUTCHours();
      const utcMinutes = localTime.getUTCMinutes();

      // Format as time with time zone for Postgres
      scheduleTimeObj = `${utcHours.toString().padStart(2, "0")}:${utcMinutes
        .toString()
        .padStart(2, "0")}:00+00`;
    }

    // Update data structure
    const updateData = {
      updated_by: userId.toString() + ":" + userName,
      trigger_on_review_comment: triggerOnReviewComment,
      trigger_on_test_failure: triggerOnTestFailure,
      trigger_on_commit: triggerOnCommit,
      trigger_on_merged: triggerOnMerged,
      trigger_on_schedule: triggerOnSchedule,
      schedule_frequency: triggerOnSchedule ? "daily" : null,
      schedule_time: scheduleTimeObj,
      schedule_include_weekends: scheduleIncludeWeekends,
    };

    if (existingRepo) {
      // Update existing record
      const { data, error } = await supabase
        .from("repositories")
        .update(updateData)
        .match({ owner_id: ownerId, repo_id: repoId })
        .select()
        .single();

      if (error) throw error;
    } else {
      // Create new record
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

      const { data, error } = await supabase
        .from("repositories")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Error saving trigger settings:`, error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  } finally {
    const endTime = performance.now();
    console.log(`save-trigger-settings execution time: ${endTime - startTime}ms`);
  }
}

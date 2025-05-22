import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");
    const repoId = searchParams.get("repoId");

    if (!ownerId || !repoId)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    const { data: settings, error: settingsError } = await supabase
      .from("repositories")
      .select(
        `
        trigger_on_review_comment,
        trigger_on_test_failure,
        trigger_on_commit,
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
      console.log("No trigger settings found, returning default values");
      return NextResponse.json({
        trigger_on_review_comment: true,
        trigger_on_test_failure: true,
        trigger_on_commit: false,
        trigger_on_merged: false,
        trigger_on_schedule: false,
        schedule_frequency: "daily",
        schedule_time: "09:00",
        schedule_include_weekends: false,
      });
    }

    if (settingsError) throw settingsError;

    // Convert UTC time to local time before sending to frontend
    if (settings.schedule_time) {
      try {
        // Parse the time string from DB (format: HH:MM:SS+00)
        const timeParts = settings.schedule_time.split(":");
        const utcHours = parseInt(timeParts[0], 10);
        const utcMinutes = parseInt(timeParts[1], 10);

        // Create Date object with current date and UTC time
        const date = new Date();
        date.setUTCHours(utcHours, utcMinutes, 0, 0);

        // Get local time components
        settings.schedule_time = `${date.getHours().toString().padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      } catch (e) {
        console.error("Failed to convert schedule time from UTC to local:", e);
      }
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to load trigger settings:", error);
    return NextResponse.json({ error: "Failed to load trigger settings" }, { status: 500 });
  }
}

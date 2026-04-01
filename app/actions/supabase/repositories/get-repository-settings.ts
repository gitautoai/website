"use server";

import { slackUs } from "@/app/actions/slack/slack-us";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function getRepositorySettings(ownerId: number, repoId: number) {
  try {
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("repositories")
      .select("*")
      .eq("owner_id", ownerId)
      .eq("repo_id", repoId)
      .maybeSingle();

    if (!settings) {
      console.log("No settings found, returning default values");
      return {
        use_screenshots: false,
        production_url: "",
        local_port: 8080,
        startup_commands: [],
        web_urls: [],
        file_paths: [],
        org_rules: "",
        repo_rules: "",
        user_rules: "",
        target_branch: "",
      };
    }

    if (settingsError) throw settingsError;
    return settings;
  } catch (error) {
    console.error("Failed to load settings:", error);
    await slackUs(
      `❌ Failed to load repository settings: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw new Error("Failed to load settings");
  }
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type SettingsType = "screenshot" | "rules" | "reference";

interface BaseSettings {
  ownerId: string;
  repoId: string;
  repoName: string;
  userId: string;
  settingsType: SettingsType;
}

interface ScreenshotSettings extends BaseSettings {
  settingsType: "screenshot";
  useScreenshots?: boolean;
  productionUrl?: string;
  localPort?: string;
  startupCommands?: string;
}

interface RulesSettings extends BaseSettings {
  settingsType: "rules";
  orgRules?: string;
  repoRules?: string;
  userRules?: string;
}

interface ReferenceSettings extends BaseSettings {
  settingsType: "reference";
  webUrls?: string[];
  filePaths?: string[];
}

type RepositorySettings = ScreenshotSettings | RulesSettings | ReferenceSettings;

export async function POST(request: Request) {
  const startTime = performance.now();
  try {
    const settings: RepositorySettings = await request.json();
    const { ownerId, repoId, repoName, userId, settingsType } = settings;

    if (!ownerId || !repoId || !repoName || !settingsType || !userId)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    // Check if the repository record exists
    const { data: existingRepo } = await supabase
      .from("repositories")
      .select("*")
      .match({ owner_id: ownerId, repo_id: repoId })
      .maybeSingle();

    // Prepare update data based on settings type
    const updateData: Record<string, any> = {
      updated_by: userId.toString(),
    };

    switch (settingsType) {
      case "screenshot":
        const screenshotSettings = settings as ScreenshotSettings;
        updateData.use_screenshots = screenshotSettings.useScreenshots ?? false;
        updateData.production_url = screenshotSettings.productionUrl ?? "";
        updateData.local_port = screenshotSettings.localPort ?? "8080";
        updateData.startup_commands = screenshotSettings.startupCommands
          ? screenshotSettings.startupCommands.split("\n").filter((cmd) => cmd.trim() !== "")
          : [];
        break;
      case "rules":
        const rulesSettings = settings as RulesSettings;
        updateData.org_rules = rulesSettings.orgRules ?? "";
        updateData.repo_rules = rulesSettings.repoRules ?? "";
        updateData.user_rules = rulesSettings.userRules ?? "";
        break;
      case "reference":
        const referenceSettings = settings as ReferenceSettings;
        updateData.web_urls = referenceSettings.webUrls || [];
        updateData.file_paths = referenceSettings.filePaths || [];
        break;
      default:
        return NextResponse.json({ error: "Invalid settings type" }, { status: 400 });
    }

    let result;

    if (existingRepo) {
      // Update only if record exists
      console.log("Update data: ", JSON.stringify(updateData));
      const { data, error } = await supabase
        .from("repositories")
        .update(updateData)
        .match({ owner_id: ownerId, repo_id: repoId })
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new record if it doesn't exist
      const insertData = {
        owner_id: ownerId,
        repo_id: repoId,
        repo_name: repoName,
        created_by: userId.toString(),
        // Default values for all fields
        org_rules: "",
        repo_rules: "",
        user_rules: "",
        use_screenshots: false,
        production_url: "",
        local_port: "8080",
        startup_commands: [],
        // Explicitly set empty arrays for array fields
        web_urls: [],
        file_paths: [],
        ...updateData, // Override defaults with provided values
      };

      const { data, error } = await supabase
        .from("repositories")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error saving repository settings:`, error);
    return NextResponse.json({ error: "Failed to save repository settings" }, { status: 500 });
  } finally {
    const endTime = performance.now();
    console.log(`save-repository-settings execution time: ${endTime - startTime}ms`);
  }
}

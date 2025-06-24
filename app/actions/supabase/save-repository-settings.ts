"use server";

import { supabase } from "@/lib/supabase";
import { Settings } from "@/app/settings/types";
import { TablesInsert, TablesUpdate } from "@/types/supabase";

export async function saveRepositorySettings(
  ownerId: number,
  repoId: number,
  repoName: string,
  userId: number,
  userName: string,
  settings: Settings
) {
  const startTime = performance.now();
  try {
    if (!ownerId || !repoId || !repoName || !userId) throw new Error("Missing required parameters");

    // Check if the repository record exists
    const { data: existingRepo } = await supabase
      .from("repositories")
      .select("*")
      .match({ owner_id: ownerId, repo_id: repoId })
      .maybeSingle();

    const updateData: TablesUpdate<"repositories"> = {
      updated_by: userId.toString() + ":" + userName,
    };

    // Add key if it exists
    if ("repoRules" in settings) updateData.repo_rules = settings.repoRules;
    if ("structuredRules" in settings) updateData.structured_rules = settings.structuredRules;
    if ("targetBranch" in settings) updateData.target_branch = settings.targetBranch;
    if ("webUrls" in settings) {
      updateData.web_urls = settings.webUrls.filter((url) => url !== "") || [];
    }
    if ("filePaths" in settings) {
      updateData.file_paths = settings.filePaths.filter((path) => path !== "") || [];
    }
    if ("useScreenshots" in settings) updateData.use_screenshots = settings.useScreenshots;
    if ("productionUrl" in settings) updateData.production_url = settings.productionUrl;
    if ("localPort" in settings) updateData.local_port = settings.localPort;
    if ("startupCommands" in settings) {
      updateData.startup_commands = settings.startupCommands.filter((cmd) => cmd.trim() !== "");
    }

    if (existingRepo) {
      const { error } = await supabase
        .from("repositories")
        .update(updateData)
        .match({ owner_id: ownerId, repo_id: repoId });

      if (error) throw error;
    } else {
      // Insert new data
      const insertData: TablesInsert<"repositories"> = {
        owner_id: ownerId,
        repo_id: repoId,
        repo_name: repoName,
        created_by: userId.toString() + ":" + userName,
        updated_by: userId.toString() + ":" + userName,

        // Default values
        repo_rules: "",
        structured_rules: null,
        target_branch: "",
        use_screenshots: false,
        production_url: "",
        local_port: 8080,
        startup_commands: [],

        // Explicitly set empty arrays for array fields
        web_urls: [],
        file_paths: [],

        // Override defaults with provided values
        ...updateData,
      };

      const { error } = await supabase.from("repositories").insert(insertData);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error(`Error saving repository settings:`, error);
    throw new Error("Failed to save settings");
  } finally {
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    if (executionTime > 1000) {
      console.log(`save-repository-settings execution time: ${executionTime}ms`);
    }
  }
}

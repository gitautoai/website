import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Define the database column types
type RepositoryRecord = {
  owner_id: number;
  repo_id: number;
  repo_name: string;
  created_by: string;
  updated_by: string;
  repo_rules: string;
  target_branch: string;
  use_screenshots: boolean;
  production_url: string;
  local_port: number;
  startup_commands: string[];
  web_urls: string[];
  file_paths: string[];
};

export async function POST(request: Request) {
  const startTime = performance.now();
  try {
    const { ownerId, repoId, repoName, userId, userName, ...settings } = await request.json();

    if (!ownerId || !repoId || !repoName || !userId)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    // Check if the repository record exists
    const { data: existingRepo } = await supabase
      .from("repositories")
      .select("*")
      .match({ owner_id: ownerId, repo_id: repoId })
      .maybeSingle();

    // Update data
    const updateData: Partial<RepositoryRecord> = {
      updated_by: userId.toString() + ":" + userName,

      // Convert to snake_case and update if provided
      repo_rules: settings.repoRules ?? undefined,
      target_branch: settings.targetBranch ?? undefined,
      use_screenshots: settings.useScreenshots ?? undefined,
      production_url: settings.productionUrl ?? undefined,
      local_port: settings.localPort ?? undefined,
      startup_commands: Array.isArray(settings.startupCommands)
        ? settings.startupCommands.filter((cmd: string) => cmd.trim() !== "")
        : typeof settings.startupCommands === "string"
        ? settings.startupCommands.split("\n").filter((cmd: string) => cmd.trim() !== "")
        : undefined,
      web_urls: settings.webUrls ?? undefined,
      file_paths: settings.filePaths ?? undefined,
    };

    // Delete undefined properties
    Object.keys(updateData).forEach(
      (key) =>
        updateData[key as keyof typeof updateData] === undefined &&
        delete updateData[key as keyof typeof updateData]
    );

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
    } else {
      // Insert new data
      const insertData: RepositoryRecord = {
        owner_id: ownerId,
        repo_id: repoId,
        repo_name: repoName,
        created_by: userId.toString() + ":" + userName,
        updated_by: userId.toString() + ":" + userName,

        // Default values
        repo_rules: "",
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

      const { data, error } = await supabase
        .from("repositories")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Error saving repository settings:`, error);
    return NextResponse.json({ success: false }, { status: 500 });
  } finally {
    const endTime = performance.now();
    console.log(`save-repository-settings execution time: ${endTime - startTime}ms`);
  }
}

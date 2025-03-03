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
      .select("*")
      .eq("owner_id", ownerId)
      .eq("repo_id", repoId)
      .maybeSingle();

    if (!settings) {
      console.log("No settings found, returning default values");
      return NextResponse.json({
        use_screenshots: false,
        production_url: "",
        local_port: 8080,
        startup_commands: [],
        web_urls: [],
        file_paths: [],
        org_rules: "",
        repo_rules: "",
        user_rules: "",
      });
    }

    if (settingsError) throw settingsError;
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

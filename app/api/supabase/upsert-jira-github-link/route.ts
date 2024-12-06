import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface JiraGithubLinkData {
  jira_site_id: string;
  jira_site_name: string;
  jira_project_id: number;
  jira_project_name: string;
  github_owner_id: number;
  github_owner_name: string;
  github_repo_id: number;
  github_repo_name: string;
  created_by: number;
  updated_by: number;
}

export async function POST(request: Request) {
  try {
    const body: JiraGithubLinkData = await request.json();
    // console.log("body: ", body);
    const requiredFields = [
      "jira_site_id",
      "jira_site_name",
      "jira_project_id",
      "jira_project_name",
      "github_owner_id",
      "github_owner_name",
      "github_repo_id",
      "github_repo_name",
      "created_by",
      "updated_by",
    ];

    // Check if all required fields are present
    const missingFields = requiredFields.filter((field) => !(field in body));
    if (missingFields.length > 0)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );

    // Upsert the data into the database
    const { data, error } = await supabase.from("jira_github_links").upsert(
      {
        ...body,
        updated_at: new Date(),
      },
      {
        onConflict: "jira_site_id,jira_project_id,github_owner_id,github_repo_id",
        ignoreDuplicates: false,
      }
    );

    if (error) throw error;
    return NextResponse.json(true);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to upsert Jira-GitHub link" }, { status: 500 });
  }
}

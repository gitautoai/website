import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  try {
    const { jira_site_id, jira_project_id, github_owner_id, github_repo_id } = await request.json();
    if (!jira_site_id || !jira_project_id || !github_owner_id || !github_repo_id)
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("jira_github_links")
      .delete()
      .eq("jira_site_id", jira_site_id)
      .eq("jira_project_id", jira_project_id)
      .eq("github_owner_id", github_owner_id)
      .eq("github_repo_id", github_repo_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

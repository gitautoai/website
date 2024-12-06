import { NextResponse } from "next/server";
import { getUserJiraAccess } from "@/lib/jira";
import { getOAuthToken } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

  try {
    // Get Jira access token from Supabase
    const accessToken = await getOAuthToken(userId, "jira");
    if (!accessToken) return NextResponse.json({ sites: [] });

    const sitesWithProjects = await getUserJiraAccess(accessToken);
    return NextResponse.json(sitesWithProjects);
  } catch (error) {
    console.error("Error in Jira access API:", error);
    return NextResponse.json({ error: "Failed to fetch Jira access" }, { status: 500 });
  }
}

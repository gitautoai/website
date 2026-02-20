import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const { error } = await supabaseAdmin
      .from("oauth_tokens")
      .delete()
      .eq("user_id", userId)
      .eq("service_name", "jira");

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Jira:", error);
    return NextResponse.json({ error: "Failed to disconnect from Jira" }, { status: 500 });
  }
}

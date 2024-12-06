import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const { error } = await supabase
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

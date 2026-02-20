import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");
    if (!ownerId) {
      console.log("ownerId is required");
      return NextResponse.json({ error: "owner_id is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("installations")
      .select("installation_id")
      .eq("owner_id", Number(ownerId))
      .is("uninstalled_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log("error: ", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const installationId = data?.installation_id || null;
    // console.log("installationId: ", installationId);
    return NextResponse.json({ installationId });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

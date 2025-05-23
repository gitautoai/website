import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ownerId, repoId } = await request.json();
    if (!ownerId || !repoId)
      return NextResponse.json({ error: "Owner ID and Repo ID are required" }, { status: 400 });

    const { data, error } = await supabase
      .from("coverages")
      .select("*")
      .eq("owner_id", ownerId)
      .eq("repo_id", repoId);

    if (error) {
      console.error("Error fetching coverage data:", error);
      return NextResponse.json({ error: "Failed to fetch coverage data" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in get-coverage-data route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

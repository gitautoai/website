"use server";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { Octokit } from "@octokit/rest";

// Utils
import { stringify } from "@/utils/transform";

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  // Add caching headers
  const headers = {
    "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=300",
  };

  try {
    const body = await req.json();
    const { userId, accessToken } = body;

    if (!userId || !accessToken) {
      return new NextResponse("Missing required parameters: userId or accessToken", {
        status: 400,
      });
    }

    // Use GitHub API to get organizations the user belongs to
    const octokit = new Octokit({ auth: accessToken });

    // Get user's organizations
    const { data: orgs } = await octokit.orgs.listForAuthenticatedUser();

    // Combine user's own ID with organization IDs
    const ownerIds = [userId, ...orgs.map((org) => org.id)];

    // Get installations for these owners
    const { data: installationsData, error: installationsError } = await supabase
      .from("installations")
      .select(
        `
        *,
        owners (
          owner_id,
          stripe_customer_id,
          created_at,
          created_by
        )
      `
      )
      .in("owner_id", ownerIds)
      .is("uninstalled_at", null);

    if (installationsError) throw installationsError;

    // Transform the data to match the expected format
    const installations = installationsData.map((installation) => ({
      installation_id: installation.installation_id,

      // Owner properties
      owner_id: installation.owner_id,
      owner_type: installation.owner_type,
      owner_name: installation.owner_name,

      // Other properties
      stripe_customer_id: installation.owners?.stripe_customer_id || null,
    }));

    return new NextResponse(stringify(installations), { status: 200, headers });
  } catch (err: any) {
    console.error("Error in get-user-info:", err);
    const errorMessage = err.message || "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  } finally {
    const endTime = performance.now();
    console.log(`get-user-info execution time: ${endTime - startTime}ms`);
  }
}

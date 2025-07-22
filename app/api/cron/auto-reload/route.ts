import { NextRequest, NextResponse } from "next/server";
import { checkAllAutoReloads } from "@/app/actions/supabase/owners/check-all-auto-reloads";
import { verifyVercelCron } from "@/utils/auth/vercel-cron";

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel cron
    const authError = verifyVercelCron(request);
    if (authError) return authError;

    console.log("Running auto-reload check...");

    const result = await checkAllAutoReloads();

    console.log(`Auto-reload check completed: processed ${result.processed} owners`);

    return NextResponse.json({
      message: `Processed ${result.processed} owners`,
      ...result,
    });
  } catch (error) {
    console.error("Auto-reload cron job failed:", error);
    return NextResponse.json(
      {
        error: "Auto-reload check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

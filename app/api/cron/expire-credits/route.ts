import { NextRequest, NextResponse } from "next/server";
import { expireCredits } from "@/app/actions/cron/expire-credits";
import { verifyVercelCron } from "@/utils/auth/vercel-cron";

// Vercel cron sends GET requests
export async function GET(req: NextRequest) {
  try {
    const authError = verifyVercelCron(req);
    if (authError) return authError;

    console.log("[expire-credits] Cron triggered");
    const result = await expireCredits();
    console.log(`[expire-credits] Done: expired=${result.expired}`);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[expire-credits] Failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Credit expiration failed",
      },
      { status: 500 },
    );
  }
}

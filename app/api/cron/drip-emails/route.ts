import { NextRequest, NextResponse } from "next/server";
import { processDripEmails } from "@/app/actions/cron/drip-emails";
import { verifyVercelCron } from "@/utils/auth/vercel-cron";

// Read by Vercel at build time. Hobby: 300s (Fluid Compute) or 60s (without).
export const maxDuration = 300;

// Vercel cron sends GET requests
export async function GET(req: NextRequest) {
  const start = Date.now();
  console.log("[drip-emails] Cron triggered");

  try {
    const authError = verifyVercelCron(req);
    if (authError) {
      console.error("[drip-emails] Auth failed");
      return authError;
    }

    const result = await processDripEmails();
    const duration = Date.now() - start;
    console.log(`[drip-emails] Done in ${duration}ms: sent=${result.sent} total=${result.total}`);

    return NextResponse.json({ success: true, duration, ...result });
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[drip-emails] Failed after ${duration}ms:`, error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Drip email job failed",
        duration,
      },
      { status: 500 },
    );
  }
}

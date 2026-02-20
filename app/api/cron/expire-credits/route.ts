import { NextRequest, NextResponse } from "next/server";
import { expireCredits } from "@/app/actions/cron/expire-credits";
import { verifyVercelCron } from "@/utils/auth/vercel-cron";

export async function POST(req: NextRequest) {
  try {
    // Verify the request is from Vercel cron
    const authError = verifyVercelCron(req);
    if (authError) return authError;

    // Run the credit expiration job
    const result = await expireCredits();

    return NextResponse.json({
      success: true,
      message: `Expired credits for ${result.expired} owners`,
      ...result,
    });
  } catch (error) {
    console.error("Credit expiration API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Credit expiration failed",
      },
      { status: 500 },
    );
  }
}

// Allow GET for health checks
export async function GET() {
  return NextResponse.json({
    service: "credit-expiration",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}

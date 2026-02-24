import { NextRequest, NextResponse } from "next/server";
import { processDripEmails } from "@/app/actions/cron/drip-emails";
import { verifyVercelCron } from "@/utils/auth/vercel-cron";

export async function POST(req: NextRequest) {
  try {
    const authError = verifyVercelCron(req);
    if (authError) return authError;

    const result = await processDripEmails();

    return NextResponse.json({
      success: true,
      message: `Sent ${result.sent} drip emails`,
      ...result,
    });
  } catch (error) {
    console.error("Drip email cron error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Drip email job failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "drip-emails",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}

import { NextRequest, NextResponse } from "next/server";

export const verifyVercelCron = (request: NextRequest): NextResponse | null => {
  const userAgent = request.headers.get("user-agent");

  if (!userAgent?.includes("vercel-cron")) {
    return NextResponse.json(
      { error: "Unauthorized - Not a valid Vercel cron request" },
      { status: 401 }
    );
  }

  return null;
};

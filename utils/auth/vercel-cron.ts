import { NextRequest, NextResponse } from "next/server";

export const verifyVercelCron = (request: NextRequest): NextResponse | null => {
  const cronHeader = request.headers.get('x-vercel-cron');
  const userAgent = request.headers.get('user-agent');
  
  if (cronHeader !== '1' || !userAgent?.includes('vercel-cron')) {
    return NextResponse.json(
      { error: 'Unauthorized - Not a valid Vercel cron request' }, 
      { status: 401 }
    );
  }
  
  return null;
};
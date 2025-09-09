import { NextRequest, NextResponse } from "next/server";

export const verifyVercelCron = (request: NextRequest): NextResponse | null => {
  const cronHeader = request.headers.get('x-vercel-cron');
  const userAgent = request.headers.get('user-agent');
  
  // Debug logging
  console.log('=== CRON AUTH DEBUG ===');
  console.log('cronHeader:', JSON.stringify(cronHeader));
  console.log('userAgent:', JSON.stringify(userAgent));
  console.log('cronHeader === "1":', cronHeader === '1');
  console.log('userAgent includes vercel-cron:', userAgent?.includes('vercel-cron'));
  console.log('All headers:', Object.fromEntries(request.headers.entries()));
  console.log('========================');
  
  if (cronHeader !== '1' || !userAgent?.includes('vercel-cron')) {
    return NextResponse.json(
      { error: 'Unauthorized - Not a valid Vercel cron request' }, 
      { status: 401 }
    );
  }
  
  return null;
};
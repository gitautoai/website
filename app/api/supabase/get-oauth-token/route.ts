import { getOAuthToken } from "@/app/actions/supabase/oauth_tokens/get-oauth-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const serviceName = searchParams.get("serviceName");
    if (!userId || !serviceName)
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });

    const accessToken = await getOAuthToken(Number(userId), serviceName);
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error fetching OAuth token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { ATLASSIAN_CLIENT_ID, ATLASSIAN_CLIENT_SECRET, ATLASSIAN_TOKEN_URL } from "@/config";
import { upsertOAuthToken } from "@/app/actions/supabase/oauth_tokens/upsert-oauth-token";

export async function POST(request: Request) {
  try {
    const { refreshToken, userId } = await request.json();
    if (!refreshToken || !userId) {
      return NextResponse.json(
        { error: "Refresh token and user ID are required" },
        { status: 400 }
      );
    }

    // Refreshing tokens
    // https://developer.atlassian.com/cloud/oauth/getting-started/refresh-tokens/
    const response = await fetch(ATLASSIAN_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        client_id: ATLASSIAN_CLIENT_ID,
        client_secret: ATLASSIAN_CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Failed to refresh token", details: error },
        { status: response.status }
      );
    }

    const jiraData = await response.json();

    // Prepare and store the token data
    await upsertOAuthToken({
      user_id: userId,
      service_name: "jira",
      access_token: jiraData.access_token,
      refresh_token: jiraData.refresh_token,
      scope: jiraData.scope,
      expires_in: jiraData.expires_in,
      created_by: userId,
    });

    return NextResponse.json({ accessToken: jiraData.access_token });
  } catch (error) {
    console.error("Error refreshing Jira token:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to refresh Jira token", message: errorMessage },
      { status: 500 }
    );
  }
}

import { ATLASSIAN_AUTHORIZE_URL, ATLASSIAN_CLIENT_ID, ATLASSIAN_REDIRECT_URI } from "@/config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get userId from query parameter
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  // Generate Jira authorization URL, which will ask the user to sign in and grant access to GitAuto Jira OAuth app, and then redirect to the redirect URI, another API route, with an authorization code.
  // https://developer.atlassian.com/cloud/jira/service-desk/oauth-2-authorization-code-grants-3lo-for-apps/#1--direct-the-user-to-the-authorization-url-to-get-an-authorization-code
  // What is offline_access: https://developer.atlassian.com/cloud/jira/service-desk/oauth-2-authorization-code-grants-3lo-for-apps/#use-a-refresh-token-to-get-another-access-token-and-refresh-token-pair
  const state = encodeURIComponent(userId);
  const scopes = encodeURIComponent("read:jira-work offline_access");
  const redirectUri = encodeURIComponent(ATLASSIAN_REDIRECT_URI);
  const jiraAuthUrl = `${ATLASSIAN_AUTHORIZE_URL}?audience=api.atlassian.com&client_id=${ATLASSIAN_CLIENT_ID}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}&response_type=code&prompt=consent`;
  return NextResponse.json({ url: jiraAuthUrl });
}

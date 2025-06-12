// This API endpoint should be identical to the one in https://developer.atlassian.com/console/myapps/b7aee3f7-7512-4f48-9d2d-73703cd9d38f/authorization/auth-code-grant and https://developer.atlassian.com/console/myapps/e2807e7d-f001-4838-9654-1cd0233e9726/authorization/auth-code-grant
import { NextResponse } from "next/server";
import {
  ATLASSIAN_CLIENT_ID,
  ATLASSIAN_CLIENT_SECRET,
  ATLASSIAN_REDIRECT_URI,
  ATLASSIAN_TOKEN_URL,
} from "@/config";
import { NEXT_PUBLIC_SITE_URL } from "@/config/urls";
import { upsertOAuthToken } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  // const { setIntegrations, integrations } = useAccountContext();

  // Validate the request
  if (!code || !state) return NextResponse.redirect("/settings/integrations/jira?success=false");

  try {
    // 1. Get Jira access token
    // https://developer.atlassian.com/cloud/jira/service-desk/oauth-2-authorization-code-grants-3lo-for-apps/#2--exchange-authorization-code-for-access-token
    const tokenResponse = await fetch(ATLASSIAN_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: ATLASSIAN_CLIENT_ID,
        client_secret: ATLASSIAN_CLIENT_SECRET,
        code,
        redirect_uri: ATLASSIAN_REDIRECT_URI,
      }),
    });
    const tokenData = await tokenResponse.json();
    // console.log("tokenData", tokenData);

    // 2. Save Jira integration information to the database
    await upsertOAuthToken({
      user_id: state,
      service_name: "jira",
      ...tokenData,
    });

    return NextResponse.redirect(`${NEXT_PUBLIC_SITE_URL}/settings/integrations/jira?success=true`);
  } catch (error) {
    console.error("Error in Jira callback:", error);
    return NextResponse.redirect(
      `${NEXT_PUBLIC_SITE_URL}/settings/integrations/jira?success=false`
    );
  }
}

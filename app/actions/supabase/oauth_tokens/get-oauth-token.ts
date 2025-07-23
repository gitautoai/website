// Local imports
import { BASE_URL } from "@/config/urls";
import { supabaseAdmin } from "../../../../lib/supabase/server";

export const getOAuthToken = async (userId: number, serviceName: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("oauth_tokens")
      .select("*")
      .eq("user_id", userId)
      .eq("service_name", serviceName);
    if (error) throw error;
    if (!data.length) return null;
    const expiresAt = data[0].expires_at;

    // If not expired, return the access token
    const now = new Date();
    const expiresAtWithZ = expiresAt?.endsWith("Z") ? expiresAt : expiresAt + "Z";
    if (expiresAt && new Date(expiresAtWithZ).getTime() > now.getTime()) {
      // console.log("Token is not expired");
      const accessToken: string = data[0].access_token;
      return accessToken;
    }

    // If expired, refresh the token (and update the database in the API)
    console.log("Refreshing token");
    const refreshToken = data[0]?.refresh_token;
    const response = await fetch(`${BASE_URL}/api/jira/refresh`, {
      method: "POST",
      body: JSON.stringify({ refreshToken, userId }),
    });
    if (!response.ok) throw new Error("Failed to refresh Jira token");
    const newTokenData = await response.json();
    return newTokenData.accessToken as string;
  } catch (error) {
    console.error("Failed to get OAuth token:", error);
    throw error;
  }
};

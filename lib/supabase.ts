// Third-party imports
import { createClient } from "@supabase/supabase-js";

// Local imports
import { NEXT_PUBLIC_SITE_URL } from "@/config/urls";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRoleKey) throw new Error("Supabase credentials are not set");
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface TokenData {
  user_id: number; // GitHub user ID
  service_name: string;
  access_token: string;
  refresh_token?: string | null;
  scope: string;
  expires_in: number;
  created_by: number;
}

export const getOAuthToken = async (userId: string, serviceName: string) => {
  try {
    const { data, error } = await supabase
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
    const response = await fetch(`${NEXT_PUBLIC_SITE_URL}/api/jira/refresh`, {
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

/**
 * @see https://supabase.com/docs/reference/javascript/upsert
 * @see https://supabase.com/dashboard/project/dkrxtcbaqzrodvsagwwn/editor/94700?schema=public&view=definition
 */
export const upsertOAuthToken = async (tokenData: TokenData) => {
  try {
    const { data, error } = await supabase.from("oauth_tokens").upsert(
      {
        user_id: tokenData.user_id,
        service_name: tokenData.service_name,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        scope: tokenData.scope,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
        // created_at is automatically set by Supabase when inserting not updating
        created_by: tokenData.user_id,
        updated_at: new Date(),
        updated_by: tokenData.user_id,
      },
      {
        onConflict: "user_id,service_name",
        ignoreDuplicates: false,
      }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to upsert OAuth token:", error);
    throw error;
  }
};

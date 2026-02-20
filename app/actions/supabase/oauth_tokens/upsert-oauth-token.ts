import { supabaseAdmin } from "../../../../lib/supabase/server";
import type { Database } from "@/types/supabase";

interface TokenData {
  user_id: number; // GitHub user ID
  service_name: string;
  access_token: string;
  refresh_token?: string | null;
  scope: string;
  expires_in: number;
  created_by: number;
}

/**
 * @see https://supabase.com/docs/reference/javascript/upsert
 * @see https://supabase.com/dashboard/project/dkrxtcbaqzrodvsagwwn/editor/94700?schema=public&view=definition
 */
export const upsertOAuthToken = async (tokenData: TokenData) => {
  try {
    const upsertData: Database["public"]["Tables"]["oauth_tokens"]["Insert"] = {
      user_id: tokenData.user_id,
      service_name: tokenData.service_name,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      created_by: tokenData.user_id,
      updated_at: new Date().toISOString(),
      updated_by: tokenData.user_id,
    };

    const { data, error } = await supabaseAdmin.from("oauth_tokens").upsert(upsertData, {
      onConflict: "user_id,service_name",
      ignoreDuplicates: false,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to upsert OAuth token:", error);
    throw error;
  }
};

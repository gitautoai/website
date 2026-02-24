"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { EmailType } from "@/types/drip-emails";

/**
 * Batch fetch all sent emails for a list of owner IDs.
 * Returns a Set-friendly map: { [owner_id]: Set<email_type> }
 */
export const getSentEmails = async (ownerIds: number[]) => {
  if (ownerIds.length === 0) {
    console.log("No owner IDs provided to getSentEmails");
    return {};
  }

  const { data, error } = await supabaseAdmin
    .from("email_sends")
    .select("owner_id, email_type")
    .in("owner_id", ownerIds);

  if (error) throw new Error(`Failed to fetch sent emails: ${error.message}`);

  const result: Record<number, Set<EmailType>> = {};
  for (const row of data || []) {
    if (!result[row.owner_id]) result[row.owner_id] = new Set();
    result[row.owner_id].add(row.email_type as EmailType);
  }

  return result;
};

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/** Get owner IDs that have purchase or auto_reload credit transactions. */
export const getPayingOwnerIds = async (ownerIds: number[]) => {
  if (ownerIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from("credits")
    .select("owner_id")
    .in("owner_id", ownerIds)
    .in("transaction_type", ["purchase", "auto_reload"]);

  if (error) {
    console.error("Failed to fetch paying owner IDs:", error.message);
    throw new Error(`Failed to fetch paying owner IDs: ${error.message}`);
  }

  return [...new Set((data || []).map((r) => r.owner_id))];
};

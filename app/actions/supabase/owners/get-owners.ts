"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Get owners by owner IDs from owners table
 * @param ownerIds - Array of owner IDs to fetch
 * @returns Array of owners
 */
export async function getOwners(ownerIds: number[]) {
  if (!ownerIds.length) {
    return [];
  }

  const { data: owners, error } = await supabaseAdmin
    .from("owners")
    .select("*")
    .in("owner_id", ownerIds);

  if (error) {
    console.error("Error fetching owners:", error);
    throw error;
  }

  return owners;
}

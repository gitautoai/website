"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Get installations for given owner IDs from installations table
 * @param ownerIds - Array of owner IDs to fetch installations for
 * @returns Array of installations
 */
export async function getInstallationsByOwnerIds(ownerIds: number[]) {
  if (!ownerIds.length) return [];

  const { data: installations, error } = await supabaseAdmin
    .from("installations")
    .select("*")
    .in("owner_id", ownerIds)
    .is("uninstalled_at", null);

  if (error) {
    console.error("Error fetching installations:", error);
    throw error;
  }

  return installations;
}
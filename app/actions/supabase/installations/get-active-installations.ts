"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/** Fetch all active installations (not uninstalled), ordered by creation date. */
export const getActiveInstallations = async () => {
  const { data, error } = await supabaseAdmin
    .from("installations")
    .select("installation_id, owner_id, owner_name, created_at")
    .is("uninstalled_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch active installations:", error.message);
    throw new Error(`Failed to fetch active installations: ${error.message}`);
  }

  return data || [];
};

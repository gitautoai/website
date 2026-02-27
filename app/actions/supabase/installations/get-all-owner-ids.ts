"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/** Fetch all distinct owner IDs from the installations table. */
export const getAllOwnerIds = async () => {
  const { data, error } = await supabaseAdmin.from("installations").select("owner_id");

  if (error) {
    console.error("Failed to fetch owner IDs:", error.message);
    throw new Error(`Failed to fetch owner IDs: ${error.message}`);
  }

  return [...new Set((data || []).map((r) => r.owner_id))];
};

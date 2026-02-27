"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export const getUninstalledInstallations = async () => {
  const { data, error } = await supabaseAdmin
    .from("installations")
    .select("*")
    .not("uninstalled_at", "is", null)
    .order("uninstalled_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch uninstalled installations:", error.message);
    throw new Error(`Failed to fetch uninstalled installations: ${error.message}`);
  }

  return data || [];
};

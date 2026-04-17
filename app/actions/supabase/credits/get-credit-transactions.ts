"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getCreditTransactions(ownerId: number | null | undefined, limit = 50) {
  if (ownerId == null) return [];
  const { data, error } = await supabaseAdmin
    .from("credits")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch credit transactions: ${error.message}`);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return data ?? [];
}

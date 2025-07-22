"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getCreditBalance(ownerId: number) {
  const { data, error } = await supabaseAdmin
    .from("owners")
    .select("credit_balance_usd")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) throw new Error(`Failed to get credit balance: ${error.message}`);
  if (!data) return 0; // No owner record found

  return data.credit_balance_usd || 0;
}

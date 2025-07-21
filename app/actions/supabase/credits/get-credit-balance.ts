"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getCreditBalance(ownerId: number) {
  const { data, error } = await supabaseAdmin
    .from("owners")
    .select("credit_balance_usd")
    .eq("owner_id", ownerId)
    .single();

  if (error) throw new Error(`Failed to get credit balance: ${error.message}`);

  return data.credit_balance_usd || 0;
}

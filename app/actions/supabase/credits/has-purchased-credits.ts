"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function hasPurchasedCredits(ownerId: number) {
  const { data, error } = await supabaseAdmin
    .from("credits")
    .select("id")
    .eq("owner_id", ownerId)
    .eq("transaction_type", "purchase")
    .limit(1);

  if (error) throw new Error(`Failed to check purchased credits: ${error.message}`);

  return (data?.length ?? 0) > 0;
}

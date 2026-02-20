"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function updateSpendingLimit({
  ownerId,
  maxSpendingLimitUsd,
}: {
  ownerId: number;
  maxSpendingLimitUsd: number | null;
}) {
  const { data, error } = await supabaseAdmin
    .from("owners")
    .update({
      max_spending_limit_usd: maxSpendingLimitUsd,
    })
    .eq("owner_id", ownerId)
    .select();

  if (error) throw new Error(`Failed to update spending limit: ${error.message}`);

  if (!data || data.length === 0) throw new Error(`Owner with ID ${ownerId} not found`);
}
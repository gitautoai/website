"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function updateSpendingLimit({
  ownerId,
  maxSpendingLimitUsd,
  updatedBy,
}: {
  ownerId: number;
  maxSpendingLimitUsd: number | null;
  updatedBy: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("owners")
    .update({
      max_spending_limit_usd: maxSpendingLimitUsd,
      updated_by: updatedBy,
    })
    .eq("owner_id", ownerId)
    .select();

  if (error) throw new Error(`Failed to update spending limit: ${error.message}`);

  if (!data || data.length === 0) throw new Error(`Owner with ID ${ownerId} not found`);
}

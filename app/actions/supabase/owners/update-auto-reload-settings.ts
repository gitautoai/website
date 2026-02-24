"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function updateAutoReloadSettings({
  ownerId,
  enabled,
  thresholdUsd,
  amountUsd,
  updatedBy,
}: {
  ownerId: number;
  enabled: boolean;
  thresholdUsd: number;
  amountUsd: number;
  updatedBy: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("owners")
    .update({
      auto_reload_enabled: enabled,
      auto_reload_threshold_usd: thresholdUsd,
      auto_reload_target_usd: amountUsd,
      updated_by: updatedBy,
    })
    .eq("owner_id", ownerId)
    .select();

  if (error) throw new Error(`Failed to update auto-reload settings: ${error.message}`);

  if (!data || data.length === 0) throw new Error(`Owner with ID ${ownerId} not found`);
}

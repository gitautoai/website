"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Set `replied_at` for all email_sends rows matching the given owner IDs
 * where `replied_at` is still null.
 */
export const markReplied = async (entries: { ownerId: number; repliedAt: string }[]) => {
  if (entries.length === 0) return;

  // Group by repliedAt to batch owners with the same timestamp
  const byTimestamp: Record<string, number[]> = {};
  for (const { ownerId, repliedAt } of entries) {
    if (!byTimestamp[repliedAt]) byTimestamp[repliedAt] = [];
    byTimestamp[repliedAt].push(ownerId);
  }

  for (const [repliedAt, ownerIds] of Object.entries(byTimestamp)) {
    const { error } = await supabaseAdmin
      .from("email_sends")
      .update({ replied_at: repliedAt, updated_at: new Date().toISOString() })
      .in("owner_id", ownerIds)
      .is("replied_at", null);

    if (error) console.error("[drip] Failed to mark replies:", error.message);
    else console.log(`[drip] Marked ${ownerIds.length} owners as replied at ${repliedAt}`);
  }
};

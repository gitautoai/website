"use server";

import { supabase } from "@/lib/supabase";

/**
 * Bulk update file sizes using upsert with existing data preservation
 */
export async function updateCoverage(
  updates: Array<{ id: number; fileSize: number; existingData: any }>,
  userId: number,
  userName: string
) {
  if (updates.length === 0) return 0;

  // Prepare upsert data with all existing fields + updated file_size
  const updateData = updates.map((update) => ({
    ...update.existingData,
    file_size: update.fileSize,
    updated_by: `${userId}:${userName}`,
  }));

  const { error } = await supabase.from("coverages").upsert(updateData, {
    onConflict: "id",
    ignoreDuplicates: false,
  });

  if (error) {
    console.error("Error bulk updating files:", error);
    throw error;
  }

  return updates.length;
}

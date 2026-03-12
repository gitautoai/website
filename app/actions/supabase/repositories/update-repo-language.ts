"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function updateRepoLanguage(ownerId: number, repoId: number, language: string) {
  const { error } = await supabaseAdmin
    .from("repositories")
    .update({ preferred_language: language })
    .eq("owner_id", ownerId)
    .eq("repo_id", repoId);
  if (error) throw error;
}

"use server";

import { upsertRepository } from "@/app/actions/supabase/repositories/upsert-repository";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export const upsertRepositoryFeatures = async (
  ownerId: number,
  ownerName: string,
  repoId: number,
  repoName: string,
  userId: number,
  userName: string,
  settings: Pick<
    Tables<"repository_features">,
    "auto_merge" | "auto_merge_only_test_files" | "merge_method"
  >
) => {
  // Ensure repository exists before upserting to repository_features
  await upsertRepository(ownerId, repoId, repoName, userId, userName);

  const { error } = await supabaseAdmin.from("repository_features").upsert(
    {
      owner_id: ownerId,
      owner_name: ownerName,
      repo_id: repoId,
      repo_name: repoName,
      auto_merge: settings.auto_merge,
      auto_merge_only_test_files: settings.auto_merge_only_test_files,
      merge_method: settings.merge_method,
      created_by: `${userId}:${userName}`,
      updated_by: `${userId}:${userName}`,
    },
    { onConflict: "owner_id,repo_id" }
  );

  if (error) throw error;
};

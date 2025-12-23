"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export const saveActionSettings = async (
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
  const missingParams = [];
  if (!ownerId) missingParams.push("ownerId");
  if (!ownerName) missingParams.push("ownerName");
  if (!repoId) missingParams.push("repoId");
  if (!repoName) missingParams.push("repoName");
  if (!userId) missingParams.push("userId");
  if (!userName) missingParams.push("userName");

  if (missingParams.length > 0)
    throw new Error(`Missing required parameters: ${missingParams.join(", ")}`);

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

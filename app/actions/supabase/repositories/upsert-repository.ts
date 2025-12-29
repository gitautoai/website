"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";

export const upsertRepository = async (
  ownerId: number,
  repoId: number,
  repoName: string,
  userId: number,
  userName: string,
  updates?: Partial<TablesUpdate<"repositories">>
) => {
  const { data: existingRepo } = await supabaseAdmin
    .from("repositories")
    .select("repo_id")
    .match({ owner_id: ownerId, repo_id: repoId })
    .maybeSingle();

  if (existingRepo) {
    const updateData: TablesUpdate<"repositories"> = {
      updated_by: `${userId}:${userName}`,
      ...updates,
    };

    const { error } = await supabaseAdmin
      .from("repositories")
      .update(updateData)
      .match({ owner_id: ownerId, repo_id: repoId });

    if (error) throw error;
    return;
  }

  const insertData: TablesInsert<"repositories"> = {
    owner_id: ownerId,
    repo_id: repoId,
    repo_name: repoName,
    created_by: `${userId}:${userName}`,
    updated_by: `${userId}:${userName}`,
    ...updates,
  };

  const { error } = await supabaseAdmin.from("repositories").insert(insertData);
  if (error) throw error;
};

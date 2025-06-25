"use server";

import { RepositoryFile } from "@/app/actions/github/fetch-repository-files";
import { supabase } from "@/lib/supabase";
import { TablesInsert } from "@/types/supabase";

/**
 * Insert new coverage files
 */
export async function insertCoverage(
  files: RepositoryFile[],
  ownerId: number,
  repoId: number,
  branchName: string,
  userId: number,
  userName: string
) {
  if (files.length === 0) return 0;

  const insertData: TablesInsert<"coverages">[] = files.map((file) => ({
    owner_id: ownerId,
    repo_id: repoId,
    package_name: null,
    level: "file",
    full_path: file.path,
    branch_name: branchName,
    line_coverage: 0,
    uncovered_lines: null,
    statement_coverage: 0,
    function_coverage: 0,
    uncovered_functions: null,
    branch_coverage: 0,
    uncovered_branches: null,
    primary_language: null,
    github_issue_url: null,
    is_excluded_from_testing: false,
    file_size: file.size,
    created_by: userId + ":" + userName,
    updated_by: userId + ":" + userName,
  }));

  const { error } = await supabase.from("coverages").insert(insertData);

  if (error) {
    console.error("Error inserting new files:", error);
    throw error;
  }

  return files.length;
}

"use server";

import { fetchRepositoryFiles } from "@/app/actions/github/fetch-repository-files";
import { getDefaultBranch } from "@/app/actions/github/get-default-branch";
import { deleteCoverage } from "@/app/actions/supabase/delete-coverage";
import { insertCoverage } from "@/app/actions/supabase/insert-coverage";
import { updateCoverage } from "@/app/actions/supabase/update-coverage";
import { CoverageData } from "@/app/dashboard/coverage/types";

/**
 * Sync repository files to coverage database
 */
export async function syncRepositoryFiles(
  ownerName: string,
  repoName: string,
  ownerId: number,
  repoId: number,
  accessToken: string,
  userId: number,
  userName: string,
  coverageData: CoverageData[]
) {
  const startTime = performance.now();

  try {
    // Get default branch
    const targetBranch = await getDefaultBranch(ownerName, repoName, accessToken);

    // Fetch repository files (only source files)
    const files = await fetchRepositoryFiles(ownerName, repoName, accessToken, targetBranch);

    // Create maps for efficient lookup
    const existingFileMap = new Map(coverageData.map((file) => [file.full_path, file]));
    const newFileMap = new Map(files.map((file) => [file.path, file]));

    // 1. Find new files to insert
    const filesToInsert = files.filter((file) => !existingFileMap.has(file.path));

    // 2. Find existing files to update (only file_size)
    const filesToUpdate = files
      .filter((file) => {
        const existing = existingFileMap.get(file.path);
        return existing && existing.file_size !== file.size;
      })
      .map((file) => {
        const existingData = existingFileMap.get(file.path)!;
        return {
          id: existingData.id,
          fileSize: file.size,
          existingData: existingData,
        };
      });

    // 3. Find files to delete (exist in DB but not in GitHub)
    const filesToDelete = coverageData.filter((file) => !newFileMap.has(file.full_path));
    const idsToDelete = filesToDelete.map((file) => file.id);

    // Execute operations
    const insertedCount = await insertCoverage(
      filesToInsert,
      ownerId,
      repoId,
      targetBranch,
      userId,
      userName
    );
    const updatedCount = await updateCoverage(filesToUpdate, userId, userName);
    const deletedCount = await deleteCoverage(idsToDelete);

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    if (executionTime > 1000) console.log(`Repository sync completed in ${executionTime}ms`);

    return {
      success: true,
      filesCount: files.length,
      inserted: insertedCount,
      updated: updatedCount,
      deleted: deletedCount,
      branch: targetBranch,
      executionTime,
    };
  } catch (error) {
    console.error("Error syncing repository files:", error);
    throw error;
  }
}

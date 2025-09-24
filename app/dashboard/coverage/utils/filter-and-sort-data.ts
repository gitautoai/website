import { Tables } from "@/types/supabase";
import { isCodeFile } from "@/utils/is-code-file";
import { isTestFile } from "@/utils/is-test-file";
import { isTypeFile } from "@/utils/is-type-file";
import { isMigrationFile } from "@/utils/is-migration-file";
import { SortField, SortDirection } from "../types";

/**
 * Apply filters and sorting to coverage data
 */
export function filterAndSortData(
  data: Tables<"coverages">[],
  selectedPackage: string,
  selectedLevel: string,
  hideFullCoverage: "all" | "hide",
  selectedExclusionFilter: string,
  sortField: SortField,
  sortDirection: SortDirection
): Tables<"coverages">[] {
  if (!data) return [];

  let filtered = data;

  // Package filter
  if (selectedPackage) filtered = filtered.filter((item) => item.package_name === selectedPackage);

  // Level filter
  if (selectedLevel) filtered = filtered.filter((item) => item.level === selectedLevel);

  // File type filtering (same logic as schedule handler) - only apply to file-level entries
  filtered = filtered.filter((item) => {
    // Always include non-file entries (repository, directory level)
    if (item.level !== "file" || !item.full_path) return true;

    const filePath = item.full_path;

    // Apply same filtering logic as schedule handler
    if (!isCodeFile(filePath)) return false;
    if (isTestFile(filePath)) return false;
    if (isTypeFile(filePath)) return false;
    if (isMigrationFile(filePath)) return false;

    return true;
  });

  // Coverage filter
  if (hideFullCoverage === "hide")
    filtered = filtered.filter((item) => (item.statement_coverage || 0) < 100);

  // Exclusion filter
  if (selectedExclusionFilter === "included") {
    filtered = filtered.filter((item) => !item.is_excluded_from_testing);
  } else if (selectedExclusionFilter === "excluded") {
    filtered = filtered.filter((item) => item.is_excluded_from_testing);
  }

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string")
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);

    if (typeof aValue === "number" && typeof bValue === "number")
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

    return 0;
  });

  return filtered;
}

import { CoverageData, SortField, SortDirection } from "@/app/dashboard/coverage/types";

/**
 * Apply filters and sorting to coverage data
 */
export function filterAndSortData(
  coverageData: CoverageData[],
  selectedPackage: string,
  selectedLevel: string,
  hideFullCoverage: "all" | "hide",
  sortField: SortField,
  sortDirection: SortDirection
): CoverageData[] {
  return coverageData
    .filter((item) => !selectedPackage || item.package_name === selectedPackage)
    .filter((item) => !selectedLevel || item.level === selectedLevel)
    .filter(
      (item) =>
        hideFullCoverage !== "hide" ||
        !(
          item.statement_coverage === 100 &&
          item.function_coverage === 100 &&
          item.branch_coverage === 100 &&
          item.line_coverage === 100
        )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparison
      const aString = String(aValue || "");
      const bString = String(bValue || "");
      return sortDirection === "asc"
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
}

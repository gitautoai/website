import { SortField, SortDirection } from "@/app/dashboard/coverage/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { safeLocalStorage } from "@/lib/local-storage";

/**
 * Handle table sorting
 */
export function handleSort(
  field: SortField,
  sortField: SortField,
  sortDirection: SortDirection,
  setSortField: (field: SortField) => void,
  setSortDirection: (direction: SortDirection) => void,
) {
  let newDirection: SortDirection;
  if (sortField === field) {
    // Toggle direction if same field
    newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    safeLocalStorage.setItem(STORAGE_KEYS.SORT_DIRECTION, newDirection);
  } else {
    // Set new field and default to descending for coverage metrics, ascending for text
    const isNumeric = [
      "statement_coverage",
      "function_coverage",
      "branch_coverage",
      "line_coverage",
    ].includes(field);
    newDirection = isNumeric ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    safeLocalStorage.setItem(STORAGE_KEYS.SORT_FIELD, field);
    safeLocalStorage.setItem(STORAGE_KEYS.SORT_DIRECTION, newDirection);
  }
}

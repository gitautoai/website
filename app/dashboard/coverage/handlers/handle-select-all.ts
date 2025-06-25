import { Tables } from "@/types/supabase";

/**
 * Handle select all/deselect all functionality
 */
export function handleSelectAll(
  filteredData: Tables<"coverages">[],
  selectedRows: number[],
  setSelectedRows: (rows: number[]) => void
) {
  const fileOnlyData = filteredData.filter((item) => item.level === "file");
  const isCurrentlySelected =
    selectedRows.length > 0 &&
    selectedRows.length === fileOnlyData.length &&
    fileOnlyData.every((item) => selectedRows.includes(item.id));

  if (!isCurrentlySelected) {
    setSelectedRows(fileOnlyData.map((item) => item.id));
  } else {
    setSelectedRows([]);
  }
}

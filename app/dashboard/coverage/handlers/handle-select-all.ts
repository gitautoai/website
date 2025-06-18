import { CoverageData } from "@/app/dashboard/coverage/types";

/**
 * Handle select all/deselect all functionality
 */
export function handleSelectAll(
  filteredData: CoverageData[],
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

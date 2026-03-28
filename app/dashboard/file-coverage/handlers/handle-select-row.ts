/**
 * Handle individual row selection toggle
 */
export function handleSelectRow(
  selectedRows: number[],
  setSelectedRows: (rows: number[]) => void,
  id: number
) {
  if (selectedRows.includes(id)) {
    setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
  } else {
    setSelectedRows([...selectedRows, id]);
  }
}

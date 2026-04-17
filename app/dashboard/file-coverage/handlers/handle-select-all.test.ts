/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { handleSelectAll } from "./handle-select-all";
import { Tables } from "@/types/supabase";

describe("handleSelectAll", () => {
  const createMockCoverage = (id: number, level: "file" | "folder" = "file") => ({
    id,
    level,
  } as Tables<"coverages">);

  // ===== solitary =====

  it("should select all file-level rows when none are selected", () => {
    // Verify that when no rows are selected, all rows with level 'file' are selected
    const filteredData = [
      createMockCoverage(1),
      createMockCoverage(2),
      createMockCoverage(3, "folder"),
    ];
    const selectedRows: number[] = [];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });

  it("should select all file-level rows when some are already selected", () => {
    // Verify that when some file-level rows are selected, it selects all of them
    const filteredData = [
      createMockCoverage(1),
      createMockCoverage(2),
      createMockCoverage(3),
    ];
    const selectedRows = [1];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2, 3]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });
  it("should select all file-level rows when selectedRows length matches but IDs differ", () => {
    // Verify that if the number of selected rows matches the number of file-level rows but the IDs are different, it selects all file-level rows
    const filteredData = [
      createMockCoverage(1),
      createMockCoverage(2),
    ];
    const selectedRows = [3, 4];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });


  it("should deselect all rows when all file-level rows are already selected", () => {
    // Verify that when all file-level rows are selected, it deselects all of them
    const filteredData = [
      createMockCoverage(1),
      createMockCoverage(2),
      createMockCoverage(3, "folder"),
    ];
    const selectedRows = [1, 2];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });

  it("should select all file-level rows when all file-level rows are selected but other levels are also selected", () => {
    // Verify that if all file-level rows are selected but other rows (e.g. folders) are also selected,
    // it results in only file-level rows being selected (effectively deselecting the others)
    const filteredData = [
      createMockCoverage(1),
      createMockCoverage(2),
      createMockCoverage(3, "folder"),
    ];
    const selectedRows = [1, 2, 3];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });

  it("should select all file-level rows when only non-file rows are selected", () => {
    // Verify that if only folder-level rows are selected, it selects all file-level rows
    const filteredData = [
      createMockCoverage(1),
      createMockCoverage(2),
      createMockCoverage(3, "folder"),
    ];
    const selectedRows = [3];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });

  it("should handle empty filteredData by calling setSelectedRows with an empty array", () => {
    // Verify that when there is no data, it results in an empty selection
    const filteredData: Tables<"coverages">[] = [];
    const selectedRows: number[] = [];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });

  it("should handle filteredData with no file-level rows by calling setSelectedRows with an empty array", () => {
    // Verify that when no file-level rows exist, it results in an empty selection
    const filteredData = [
      createMockCoverage(1, "folder"),
      createMockCoverage(2, "folder"),
    ];
    const selectedRows: number[] = [];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });

  it("should handle filteredData with no file-level rows and some selectedRows by calling setSelectedRows with an empty array", () => {
    // Verify that when no file-level rows exist but some rows are selected, it deselects all
    const filteredData = [
      createMockCoverage(1, "folder"),
      createMockCoverage(2, "folder"),
    ];
    const selectedRows = [1, 2];
    const mockSetSelectedRows = jest.fn();

    handleSelectAll(filteredData, selectedRows, mockSetSelectedRows);

    expect(mockSetSelectedRows).toHaveBeenCalledWith([]);
    expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
  });
});

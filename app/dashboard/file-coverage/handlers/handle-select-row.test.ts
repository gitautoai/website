 
import { handleSelectRow } from "./handle-select-row";

describe("handleSelectRow", () => {
  describe("deselecting rows (when row is already selected)", () => {
    it("should remove the row from selectedRows when it is already selected", () => {
      const selectedRows = [1, 2, 3];
      const mockSetSelectedRows = jest.fn();
      const id = 2;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 3]);
      expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should remove the first row when it is selected", () => {
      const selectedRows = [1, 2, 3];
      const mockSetSelectedRows = jest.fn();
      const id = 1;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([2, 3]);
    });

    it("should remove the last row when it is selected", () => {
      const selectedRows = [1, 2, 3];
      const mockSetSelectedRows = jest.fn();
      const id = 3;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2]);
    });

    it("should handle deselecting the only selected row", () => {
      const selectedRows = [5];
      const mockSetSelectedRows = jest.fn();
      const id = 5;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([]);
    });

    it("should handle deselecting from a large array", () => {
      const selectedRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const mockSetSelectedRows = jest.fn();
      const id = 5;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([
        1, 2, 3, 4, 6, 7, 8, 9, 10,
      ]);
    });
  });

  describe("selecting rows (when row is not already selected)", () => {
    it("should add the row to selectedRows when it is not already selected", () => {
      const selectedRows = [1, 2, 3];
      const mockSetSelectedRows = jest.fn();
      const id = 4;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2, 3, 4]);
      expect(mockSetSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should add the first row to an empty array", () => {
      const selectedRows: number[] = [];
      const mockSetSelectedRows = jest.fn();
      const id = 1;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([1]);
    });

    it("should add a row with id 0", () => {
      const selectedRows = [1, 2];
      const mockSetSelectedRows = jest.fn();
      const id = 0;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2, 0]);
    });

    it("should add a negative id", () => {
      const selectedRows = [1, 2];
      const mockSetSelectedRows = jest.fn();
      const id = -1;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2, -1]);
    });

    it("should add a large id number", () => {
      const selectedRows = [1, 2];
      const mockSetSelectedRows = jest.fn();
      const id = 999999;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(mockSetSelectedRows).toHaveBeenCalledWith([1, 2, 999999]);
    });
  });

  describe("edge cases", () => {
    it("should not mutate the original selectedRows array", () => {
      const selectedRows = [1, 2, 3];
      const originalSelectedRows = [...selectedRows];
      const mockSetSelectedRows = jest.fn();
      const id = 4;

      handleSelectRow(selectedRows, mockSetSelectedRows, id);

      expect(selectedRows).toEqual(originalSelectedRows);
    });
  });
});

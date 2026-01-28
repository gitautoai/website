import { handleSelectRow } from "./handle-select-row";

describe("handleSelectRow", () => {
  describe("adding rows to selection", () => {
    it("should add a row when it is not already selected", () => {
      const selectedRows: number[] = [];
      const setSelectedRows = jest.fn();
      const id = 1;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([1]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should add a row to existing selections", () => {
      const selectedRows = [1, 2, 3];
      const setSelectedRows = jest.fn();
      const id = 4;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([1, 2, 3, 4]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should add a row with id 0", () => {
      const selectedRows: number[] = [];
      const setSelectedRows = jest.fn();
      const id = 0;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([0]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should add a negative id", () => {
      const selectedRows: number[] = [];
      const setSelectedRows = jest.fn();
      const id = -1;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([-1]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should add a large id number", () => {
      const selectedRows: number[] = [];
      const setSelectedRows = jest.fn();
      const id = 999999;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([999999]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });
  });

  describe("removing rows from selection", () => {
    it("should remove a row when it is already selected", () => {
      const selectedRows = [1];
      const setSelectedRows = jest.fn();
      const id = 1;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should remove a row from multiple selections", () => {
      const selectedRows = [1, 2, 3];
      const setSelectedRows = jest.fn();
      const id = 2;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([1, 3]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should remove the first row from selections", () => {
      const selectedRows = [1, 2, 3];
      const setSelectedRows = jest.fn();
      const id = 1;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([2, 3]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should remove the last row from selections", () => {
      const selectedRows = [1, 2, 3];
      const setSelectedRows = jest.fn();
      const id = 3;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([1, 2]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });

    it("should remove id 0 from selections", () => {
      const selectedRows = [0, 1, 2];
      const setSelectedRows = jest.fn();
      const id = 0;

      handleSelectRow(selectedRows, setSelectedRows, id);

      expect(setSelectedRows).toHaveBeenCalledWith([1, 2]);
      expect(setSelectedRows).toHaveBeenCalledTimes(1);
    });
  });

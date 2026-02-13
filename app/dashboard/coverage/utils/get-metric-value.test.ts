/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { Tables } from "@/types/supabase";
import { Metric } from "../types";
import { getMetricValue } from "./get-metric-value";

describe("getMetricValue", () => {
  const mockCoverageItem: Tables<"coverages"> = {
    id: 1,
    owner_id: 1,
    repo_id: 1,
    full_path: "test/file.ts",
    file_size: 1000,
    branch_coverage: 75.5,
    branch_name: "main",
    created_at: "2024-01-01T00:00:00Z",
    created_by: "test",
    exclusion_reason: null,
    function_coverage: 90.0,
    github_issue_url: null,
    is_excluded_from_testing: null,
    language: null,
    level: "file",
    line_coverage: 80.0,
    package_name: null,
    path_coverage: null,
    statement_coverage: 85.5,
    uncovered_branches: null,
    uncovered_functions: null,
    uncovered_lines: null,
    updated_at: "2024-01-01T00:00:00Z",
    updated_by: "test",
  };

  describe("when metric is 'size'", () => {
    it("should return file_size when it exists", () => {
      const result = getMetricValue(mockCoverageItem, "size");
      expect(result).toBe(1000);
    });

    it("should return 0 when file_size is null", () => {
      const itemWithNullSize = { ...mockCoverageItem, file_size: null };
      const result = getMetricValue(itemWithNullSize, "size");
      expect(result).toBe(0);
    });
  });

  describe("when metric is 'statement'", () => {
    it("should return statement_coverage when it exists", () => {
      const result = getMetricValue(mockCoverageItem, "statement");
      expect(result).toBe(85.5);
    });

    it("should return 0 when statement_coverage is null", () => {
      const itemWithNullStatement = {
        ...mockCoverageItem,
        statement_coverage: null,
      };
      const result = getMetricValue(itemWithNullStatement, "statement");
      expect(result).toBe(0);
    });
  });

  describe("when metric is 'function'", () => {
    it("should return function_coverage when it exists", () => {
      const result = getMetricValue(mockCoverageItem, "function");
      expect(result).toBe(90.0);
    });

    it("should return 0 when function_coverage is null", () => {
      const itemWithNullFunction = {
        ...mockCoverageItem,
        function_coverage: null,
      };
      const result = getMetricValue(itemWithNullFunction, "function");
      expect(result).toBe(0);
    });
  });

  describe("when metric is 'branch'", () => {
    it("should return branch_coverage when it exists", () => {
      const result = getMetricValue(mockCoverageItem, "branch");
      expect(result).toBe(75.5);
    });

    it("should return 0 when branch_coverage is null", () => {
      const itemWithNullBranch = {
        ...mockCoverageItem,
        branch_coverage: null,
      };
      const result = getMetricValue(itemWithNullBranch, "branch");
      expect(result).toBe(0);
    });
  });

  describe("when metric is unknown", () => {
    it("should return 0 for unknown metric type", () => {
      const result = getMetricValue(mockCoverageItem, "unknown" as Metric);
      expect(result).toBe(0);
    });
  });
});

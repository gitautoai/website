export interface CoverageData {
  id: number; // Surrogate key
  package_name: string;
  level: "repository" | "directory" | "file";
  full_path: string;
  statement_coverage: number;
  function_coverage: number;
  branch_coverage: number;
  line_coverage: number;
  uncovered_lines: string;
  primary_language: string;
  github_issue_url: string;
  updated_at: string;
}

export type SortField = keyof Pick<
  CoverageData,
  "full_path" | "statement_coverage" | "function_coverage" | "branch_coverage" | "line_coverage"
>;

export type SortDirection = "asc" | "desc";

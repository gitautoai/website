export interface CoverageData {
  id: number; // Surrogate key
  package_name: string;
  level: "repository" | "directory" | "file";
  full_path: string;
  branch_name: string;
  file_size: number;
  line_coverage: number;
  uncovered_lines: string;
  statement_coverage: number;
  // uncovered_statements: string;
  function_coverage: number;
  uncovered_functions: string;
  branch_coverage: number;
  uncovered_branches: string;
  primary_language: string;
  github_issue_url: string;
  updated_at: string;
}

export type SortField = keyof Pick<
  CoverageData,
  | "full_path"
  | "file_size"
  | "statement_coverage"
  | "function_coverage"
  | "branch_coverage"
  | "line_coverage"
>;

export type SortDirection = "asc" | "desc";

export type Metric = "size" | "statement" | "function" | "branch";

export type IssueResponse = {
  coverageId: number;
  issueUrl: string;
};

export type ParentIssue = {
  id: string; // GraphQL node_id (string)
  number: number;
  title: string;
  url: string;
};

import { Tables } from "@/types/supabase";

export type SortField = keyof Pick<
  Tables<"coverages">,
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

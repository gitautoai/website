import { Metric, SortField } from "@/app/dashboard/coverage/types";

/**
 * Map mobile metric to corresponding sort field
 */
export function getSortFieldForMetric(metric: Metric): SortField {
  switch (metric) {
    case "size":
      return "file_size";
    case "statement":
      return "statement_coverage";
    case "function":
      return "function_coverage";
    case "branch":
      return "branch_coverage";
    default:
      return "statement_coverage";
  }
}

import { CoverageData, Metric } from "@/app/dashboard/coverage/types";

/**
 * Extract metric value from coverage data for mobile display
 */
export function getMetricValue(item: CoverageData, metric: Metric): number {
  switch (metric) {
    case "size":
      return item.file_size;
    case "statement":
      return item.statement_coverage;
    case "function":
      return item.function_coverage;
    case "branch":
      return item.branch_coverage;
    default:
      return 0;
  }
}

import { Tables } from "@/types/supabase";
import { Metric } from "../types";

/**
 * Extract metric value from coverage data for mobile display
 */
export function getMetricValue(item: Tables<"coverages">, metric: Metric): number {
  switch (metric) {
    case "size":
      return item.file_size || 0;
    case "statement":
      return item.statement_coverage || 0;
    case "function":
      return item.function_coverage || 0;
    case "branch":
      return item.branch_coverage || 0;
    default:
      return 0;
  }
}

import { Tables } from "@/types/supabase";
import { Metric } from "../types";

/**
 * Extract metric value from coverage data for mobile display
 */
export function getMetricValue(item: Tables<"coverages">, metric: Metric): number | null {
  switch (metric) {
    case "size":
      return item.file_size || 0;
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

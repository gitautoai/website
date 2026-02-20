import { Metric } from "@/app/dashboard/coverage/types";

/**
 * Get short header text for mobile metric display
 */
export function getMetricHeader(metric: Metric): string {
  switch (metric) {
    case "size":
      return "Size";
    case "statement":
      return "Stmt";
    case "function":
      return "Func";
    case "branch":
      return "Brch";
    default:
      return "Stmt";
  }
}

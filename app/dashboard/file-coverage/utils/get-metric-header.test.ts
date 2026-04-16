import { Metric } from "../types";
import { getMetricHeader } from "./get-metric-header";

describe("getMetricHeader", () => {
  it("should return 'Size' when metric is 'size'", () => {
    // Verify that the 'size' metric is mapped to the 'Size' header for mobile display
    expect(getMetricHeader("size")).toBe("Size");
  });

  it("should return 'Stmt' when metric is 'statement'", () => {
    // Verify that the 'statement' metric is mapped to the abbreviated 'Stmt' header
    expect(getMetricHeader("statement")).toBe("Stmt");
  });

  it("should return 'Func' when metric is 'function'", () => {
    // Verify that the 'function' metric is mapped to the abbreviated 'Func' header
    expect(getMetricHeader("function")).toBe("Func");
  });

  it("should return 'Brch' when metric is 'branch'", () => {
    // Verify that the 'branch' metric is mapped to the abbreviated 'Brch' header
    expect(getMetricHeader("branch")).toBe("Brch");
  });

  it("should return 'Stmt' as a fallback for unknown metrics", () => {
    // Verify that any unexpected metric value defaults to 'Stmt' to avoid empty headers
    expect(getMetricHeader("unknown" as Metric)).toBe("Stmt");
  });
});

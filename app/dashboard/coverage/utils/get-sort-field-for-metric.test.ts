 
import { getSortFieldForMetric } from "./get-sort-field-for-metric";

describe("getSortFieldForMetric", () => {
  it('should return "file_size" for "size" metric', () => {
    const result = getSortFieldForMetric("size");
    expect(result).toBe("file_size");
  });

  it('should return "statement_coverage" for "statement" metric', () => {
    const result = getSortFieldForMetric("statement");
    expect(result).toBe("statement_coverage");
  });

  it('should return "function_coverage" for "function" metric', () => {
    const result = getSortFieldForMetric("function");
    expect(result).toBe("function_coverage");
  });

  it('should return "branch_coverage" for "branch" metric', () => {
    const result = getSortFieldForMetric("branch");
    expect(result).toBe("branch_coverage");
  });

  it('should return "statement_coverage" for unknown metric (default case)', () => {
    const result = getSortFieldForMetric("unknown" as any);
    expect(result).toBe("statement_coverage");
  });
});

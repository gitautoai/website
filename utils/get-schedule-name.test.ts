import { getScheduleName } from "./get-schedule-name";

describe("getScheduleName", () => {
  it("should generate schedule name with positive owner and repo IDs", () => {
    const result = getScheduleName(123, 456);
    expect(result).toBe("gitauto-repo-123-456");
  });

  it("should handle single digit IDs", () => {
    const result = getScheduleName(1, 2);
    expect(result).toBe("gitauto-repo-1-2");
  });

  it("should handle large IDs", () => {
    const result = getScheduleName(999999999, 888888888);
    expect(result).toBe("gitauto-repo-999999999-888888888");
  });

  it("should handle zero IDs", () => {
    const result = getScheduleName(0, 0);
    expect(result).toBe("gitauto-repo-0-0");
  });

  it("should handle mixed ID sizes", () => {
    const result = getScheduleName(42, 1000000);
    expect(result).toBe("gitauto-repo-42-1000000");
  });

  it("should always include the gitauto-repo prefix", () => {
    expect(getScheduleName(123, 456)).toMatch(/^gitauto-repo-/);
  });
});
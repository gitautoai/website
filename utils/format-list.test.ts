import { formatList } from "./format-list";

describe("formatList", () => {
  it("returns single item as-is", () => {
    expect(formatList(["backend"])).toBe("backend");
  });

  it("joins two items with 'and'", () => {
    expect(formatList(["backend", "frontend"])).toBe("backend and frontend");
  });

  it("shows first two and count for three items", () => {
    expect(formatList(["backend", "frontend", "api"])).toBe("backend, frontend, and 1 more");
  });

  it("shows first two and count for many items", () => {
    expect(formatList(["a", "b", "c", "d", "e"])).toBe("a, b, and 3 more");
  });
});

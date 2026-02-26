import { formatPrUrl } from "./format-pr-url";

describe("formatPrUrl", () => {
  it("formats a standard PR URL", () => {
    expect(formatPrUrl("acme", "backend", 42)).toBe("https://github.com/acme/backend/pull/42");
  });

  it("handles org names with special characters", () => {
    expect(formatPrUrl("my-org", "my-repo", 1)).toBe("https://github.com/my-org/my-repo/pull/1");
  });
});

import { formatRelativeTime } from "./format-relative-time";

describe("formatRelativeTime", () => {
  it("returns 'a few weeks ago' for same month and year", () => {
    const now = new Date();
    const sameMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    expect(formatRelativeTime(sameMonth)).toBe("a few weeks ago");
  });

  it("returns 'back in {Month}' for different month, same year", () => {
    const now = new Date();
    // Pick a month that's definitely not the current month
    const otherMonth = (now.getMonth() + 6) % 12;
    const date = new Date(now.getFullYear(), otherMonth, 15).toISOString();
    const expected = new Date(now.getFullYear(), otherMonth, 15).toLocaleDateString("en-US", {
      month: "short",
    });
    expect(formatRelativeTime(date)).toBe(`back in ${expected}`);
  });

  it("returns 'back in {Month} {Year}' for different year", () => {
    const date = new Date(2024, 0, 15).toISOString(); // January 2024
    expect(formatRelativeTime(date)).toBe("back in Jan 2024");
  });
});

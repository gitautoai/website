import { convertUTCDateToLocal } from "./convert-utc-date-to-local";

describe("convertUTCDateToLocal", () => {
  it("should return a valid date string", () => {
    const result = convertUTCDateToLocal("2026-03-01");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should convert a UTC date to local date", () => {
    const result = convertUTCDateToLocal("2026-06-15");
    const utcMidnight = new Date("2026-06-15T00:00:00Z");
    const expected = `${utcMidnight.getFullYear()}-${(utcMidnight.getMonth() + 1).toString().padStart(2, "0")}-${utcMidnight.getDate().toString().padStart(2, "0")}`;
    expect(result).toBe(expected);
  });

  it("should handle year boundary dates", () => {
    const result = convertUTCDateToLocal("2026-01-01");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should handle leap year dates", () => {
    const result = convertUTCDateToLocal("2028-02-29");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

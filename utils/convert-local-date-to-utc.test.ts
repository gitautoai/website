import { convertLocalDateToUTC } from "./convert-local-date-to-utc";

describe("convertLocalDateToUTC", () => {
  it("should return a valid date string", () => {
    const result = convertLocalDateToUTC("2026-03-01");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should convert a date string to UTC", () => {
    const result = convertLocalDateToUTC("2026-06-15");
    const localMidnight = new Date("2026-06-15T00:00:00");
    const expectedUTC = localMidnight.toISOString().split("T")[0];
    expect(result).toBe(expectedUTC);
  });

  it("should handle year boundary dates", () => {
    const result = convertLocalDateToUTC("2026-01-01");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should handle end of month dates", () => {
    const result = convertLocalDateToUTC("2026-02-28");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

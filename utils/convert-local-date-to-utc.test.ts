import { convertLocalDateToUTC } from "./convert-local-date-to-utc";

describe("convertLocalDateToUTC", () => {
  describe("start of day (default)", () => {
    it("should return a valid date string", () => {
      const result = convertLocalDateToUTC("2026-03-01");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should use midnight local time for conversion", () => {
      const result = convertLocalDateToUTC("2026-06-15");
      const localMidnight = new Date("2026-06-15T00:00:00");
      const expectedUTC = localMidnight.toISOString().split("T")[0];
      expect(result).toBe(expectedUTC);
    });
  });

  describe("end of day", () => {
    it("should return a valid date string", () => {
      const result = convertLocalDateToUTC("2026-03-01", true);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should use 23:59:59 local time for conversion", () => {
      const result = convertLocalDateToUTC("2026-06-15", true);
      const localEndOfDay = new Date("2026-06-15T23:59:59");
      const expectedUTC = localEndOfDay.toISOString().split("T")[0];
      expect(result).toBe(expectedUTC);
    });
  });

  describe("edge cases", () => {
    it("should handle year boundary dates", () => {
      const result = convertLocalDateToUTC("2026-01-01");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should handle end of month dates", () => {
      const result = convertLocalDateToUTC("2026-02-28");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

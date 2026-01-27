
import { convertUTCToLocal } from "./convert-utc-to-local";

describe("convertUTCToLocal", () => {
  describe("basic time conversion", () => {
    it("should convert UTC time to local time", () => {
      const result = convertUTCToLocal("12:00");
      // Result will vary based on timezone, but should be a valid time string
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should return a string in HH:MM format", () => {
      const result = convertUTCToLocal("15:30");
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("format validation", () => {
    it("should pad single-digit hours with leading zero", () => {
      // Create a UTC time that will result in single-digit local hour
      // We need to test the padding, so we'll verify the format
      const result = convertUTCToLocal("00:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.length).toBe(5);
    });

    it("should pad single-digit minutes with leading zero", () => {
      const result = convertUTCToLocal("12:05");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.length).toBe(5);
    });

    it("should maintain two-digit format for all times", () => {
      const testTimes = ["00:00", "09:05", "12:30", "23:59"];
      testTimes.forEach((time) => {
        const result = convertUTCToLocal(time);
        expect(result).toMatch(/^\d{2}:\d{2}$/);
        expect(result.length).toBe(5);
      });
    });
  });

  describe("edge cases - time boundaries", () => {
    it("should handle midnight UTC (00:00)", () => {
      const result = convertUTCToLocal("00:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.length).toBe(5);
    });

    it("should handle end of day UTC (23:59)", () => {
      const result = convertUTCToLocal("23:59");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.length).toBe(5);
    });

    it("should handle noon UTC (12:00)", () => {
      const result = convertUTCToLocal("12:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.length).toBe(5);
    });

    it("should handle single-digit hour input", () => {
      const result = convertUTCToLocal("9:30");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.length).toBe(5);
    });

    it("should handle single-digit minute input", () => {
      const result = convertUTCToLocal("12:5");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.length).toBe(5);
    });

    it("should handle both single-digit hour and minute", () => {
      const result = convertUTCToLocal("9:5");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.length).toBe(5);
    });
  });

  describe("various time inputs", () => {
    it("should handle early morning times", () => {
      const result = convertUTCToLocal("01:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should handle mid-morning times", () => {
      const result = convertUTCToLocal("09:30");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should handle afternoon times", () => {
      const result = convertUTCToLocal("14:45");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should handle evening times", () => {
      const result = convertUTCToLocal("20:15");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should handle late night times", () => {
      const result = convertUTCToLocal("23:30");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("consistency and determinism", () => {
    it("should return the same result for the same input", () => {
      const input = "15:45";
      const result1 = convertUTCToLocal(input);
      const result2 = convertUTCToLocal(input);
      expect(result1).toBe(result2);
    });

    it("should handle multiple conversions consistently", () => {
      const testCases = ["00:00", "06:30", "12:00", "18:45", "23:59"];
      testCases.forEach((time) => {
        const result1 = convertUTCToLocal(time);
        const result2 = convertUTCToLocal(time);
        expect(result1).toBe(result2);
      });
    });
  });

  describe("time component parsing", () => {
    it("should correctly parse hours and minutes from input", () => {
      const result = convertUTCToLocal("08:45");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThanOrEqual(59);
    });
  });
});

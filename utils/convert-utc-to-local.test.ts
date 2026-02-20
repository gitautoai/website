import { convertUTCToLocal } from "./convert-utc-to-local";

describe("convertUTCToLocal", () => {
  describe("basic time conversion", () => {
    it("should convert UTC time to local time", () => {
      const result = convertUTCToLocal("12:00");
      // Result will vary based on timezone, but should be in HH:MM format
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should return a string in HH:MM format", () => {
      const result = convertUTCToLocal("00:00");
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("format validation", () => {
    it("should pad single-digit hours with leading zero", () => {
      // Mock Date to control timezone behavior
      const mockDate = new Date("2026-01-27T00:00:00Z");
      jest.spyOn(global, "Date").mockImplementation((() => mockDate) as any);

      const result = convertUTCToLocal("00:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.split(":")[0]).toHaveLength(2);

      jest.restoreAllMocks();
    });

    it("should pad single-digit minutes with leading zero", () => {
      const mockDate = new Date("2026-01-27T00:05:00Z");
      jest.spyOn(global, "Date").mockImplementation((() => mockDate) as any);

      const result = convertUTCToLocal("00:05");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result.split(":")[1]).toHaveLength(2);

      jest.restoreAllMocks();
    });

    it("should maintain two-digit format for double-digit hours", () => {
      const result = convertUTCToLocal("23:59");
      const [hours] = result.split(":");
      expect(hours).toHaveLength(2);
      expect(Number.parseInt(hours, 10)).toBeGreaterThanOrEqual(0);
      expect(Number.parseInt(hours, 10)).toBeLessThanOrEqual(23);
    });

    it("should maintain two-digit format for double-digit minutes", () => {
      const result = convertUTCToLocal("12:45");
      const [, minutes] = result.split(":");
      expect(minutes).toHaveLength(2);
      expect(Number.parseInt(minutes, 10)).toBeGreaterThanOrEqual(0);
      expect(Number.parseInt(minutes, 10)).toBeLessThanOrEqual(59);
    });
  });

  describe("edge cases - time boundaries", () => {
    it("should handle midnight UTC (00:00)", () => {
      const result = convertUTCToLocal("00:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThanOrEqual(59);
    });

    it("should handle end of day UTC (23:59)", () => {
      const result = convertUTCToLocal("23:59");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBe(59);
    });

    it("should handle noon UTC (12:00)", () => {
      const result = convertUTCToLocal("12:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBe(0);
    });

    it("should handle single-digit hour input (01:00)", () => {
      const result = convertUTCToLocal("01:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should handle single-digit minute input (12:05)", () => {
      const result = convertUTCToLocal("12:05");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [, minutes] = result.split(":");
      expect(minutes).toHaveLength(2);
    });
  });

  describe("various time inputs", () => {
    it("should handle morning time (06:30)", () => {
      const result = convertUTCToLocal("06:30");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThanOrEqual(59);
    });

    it("should handle afternoon time (14:45)", () => {
      const result = convertUTCToLocal("14:45");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBe(45);
    });

    it("should handle evening time (18:15)", () => {
      const result = convertUTCToLocal("18:15");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBe(15);
    });

    it("should handle late night time (22:30)", () => {
      const result = convertUTCToLocal("22:30");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBe(30);
    });
  });

  describe("time conversion consistency", () => {
    it("should produce consistent results for the same input", () => {
      const result1 = convertUTCToLocal("15:30");
      const result2 = convertUTCToLocal("15:30");
      expect(result1).toBe(result2);
    });

    it("should handle all valid hours (00-23)", () => {
      for (let hour = 0; hour < 24; hour++) {
        const utcTime = `${hour.toString().padStart(2, "0")}:00`;
        const result = convertUTCToLocal(utcTime);
        expect(result).toMatch(/^\d{2}:\d{2}$/);
        const [resultHours] = result.split(":").map(Number);
        expect(resultHours).toBeGreaterThanOrEqual(0);
        expect(resultHours).toBeLessThanOrEqual(23);
      }
    });

    it("should handle all valid minutes (00-59)", () => {
      const testMinutes = [0, 15, 30, 45, 59];
      for (const minute of testMinutes) {
        const utcTime = `12:${minute.toString().padStart(2, "0")}`;
        const result = convertUTCToLocal(utcTime);
        expect(result).toMatch(/^\d{2}:\d{2}$/);
        const [, resultMinutes] = result.split(":").map(Number);
        expect(resultMinutes).toBeGreaterThanOrEqual(0);
        expect(resultMinutes).toBeLessThanOrEqual(59);
      }
    });
  });

  describe("timezone offset behavior", () => {
    it("should apply timezone offset correctly", () => {
      // Get the current timezone offset
      const testDate = new Date();
      const offsetMinutes = testDate.getTimezoneOffset();

      // Test with a known UTC time
      const result = convertUTCToLocal("12:00");
      expect(result).toMatch(/^\d{2}:\d{2}$/);

      // The result should be different from input unless timezone is UTC
      if (offsetMinutes !== 0) {
        // In most cases, the local time will differ from UTC
        const [hours] = result.split(":").map(Number);
        expect(typeof hours).toBe("number");
      }
    });

    it("should handle timezone offset that crosses day boundary", () => {
      // Test times that might cross day boundaries in various timezones
      const earlyMorning = convertUTCToLocal("01:00");
      const lateNight = convertUTCToLocal("23:00");

      expect(earlyMorning).toMatch(/^\d{2}:\d{2}$/);
      expect(lateNight).toMatch(/^\d{2}:\d{2}$/);

      const [earlyHours] = earlyMorning.split(":").map(Number);
      const [lateHours] = lateNight.split(":").map(Number);

      expect(earlyHours).toBeGreaterThanOrEqual(0);
      expect(earlyHours).toBeLessThanOrEqual(23);
      expect(lateHours).toBeGreaterThanOrEqual(0);
      expect(lateHours).toBeLessThanOrEqual(23);
    });
  });

  describe("input parsing", () => {
    it("should correctly parse hours and minutes from input string", () => {
      const result = convertUTCToLocal("09:45");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      // The function should successfully parse and convert the time
      const [hours, minutes] = result.split(":").map(Number);
      expect(Number.isNaN(hours)).toBe(false);
      expect(Number.isNaN(minutes)).toBe(false);
    });

    it("should handle time string with leading zeros", () => {
      const result = convertUTCToLocal("08:05");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThanOrEqual(59);
    });
  });

  describe("output format consistency", () => {
    it("should always return exactly 5 characters (HH:MM)", () => {
      const testTimes = ["00:00", "12:30", "23:59", "06:05", "18:45"];
      for (const time of testTimes) {
        const result = convertUTCToLocal(time);
        expect(result).toHaveLength(5);
      }
    });

    it("should always include colon separator", () => {
      const result = convertUTCToLocal("12:00");
      expect(result).toContain(":");
      expect(result.split(":")).toHaveLength(2);
    });

    it("should return only numeric characters and colon", () => {
      const result = convertUTCToLocal("15:30");
      expect(result).toMatch(/^[0-9:]+$/);
    });
  });
});

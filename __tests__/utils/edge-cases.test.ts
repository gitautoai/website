import { createCronExpression } from "@/utils/create-cron-expression";
import { getScheduleName } from "@/utils/get-schedule-name";

describe("Utility Functions Edge Cases", () => {
  describe("createCronExpression edge cases", () => {
    it("should handle time with leading zeros", () => {
      expect(createCronExpression("01:05", true)).toBe("cron(5 1 * * ? *)");
      expect(createCronExpression("01:05", false)).toBe("cron(5 1 ? * MON-FRI *)");
    });

    it("should handle boundary times", () => {
      // Start of day
      expect(createCronExpression("00:00", true)).toBe("cron(0 0 * * ? *)");
      expect(createCronExpression("00:00", false)).toBe("cron(0 0 ? * MON-FRI *)");
      
      // End of day
      expect(createCronExpression("23:59", true)).toBe("cron(59 23 * * ? *)");
      expect(createCronExpression("23:59", false)).toBe("cron(59 23 ? * MON-FRI *)");
    });

    it("should handle noon and midnight variations", () => {
      expect(createCronExpression("12:00", true)).toBe("cron(0 12 * * ? *)");
      expect(createCronExpression("12:30", false)).toBe("cron(30 12 ? * MON-FRI *)");
    });

    it("should handle various minute intervals", () => {
      expect(createCronExpression("09:15", true)).toBe("cron(15 9 * * ? *)");
      expect(createCronExpression("09:30", true)).toBe("cron(30 9 * * ? *)");
      expect(createCronExpression("09:45", true)).toBe("cron(45 9 * * ? *)");
    });
  });

  describe("getScheduleName edge cases", () => {
    it("should handle very large ID numbers", () => {
      const maxSafeInteger = Number.MAX_SAFE_INTEGER;
      const result = getScheduleName(maxSafeInteger, maxSafeInteger);
      expect(result).toBe(`gitauto-repo-${maxSafeInteger}-${maxSafeInteger}`);
    });

    it("should handle zero values", () => {
      expect(getScheduleName(0, 0)).toBe("gitauto-repo-0-0");
      expect(getScheduleName(0, 123)).toBe("gitauto-repo-0-123");
      expect(getScheduleName(123, 0)).toBe("gitauto-repo-123-0");
    });

    it("should handle single digit numbers", () => {
      expect(getScheduleName(1, 2)).toBe("gitauto-repo-1-2");
      expect(getScheduleName(9, 8)).toBe("gitauto-repo-9-8");
    });

    it("should handle mixed size numbers", () => {
      expect(getScheduleName(1, 1000000)).toBe("gitauto-repo-1-1000000");
      expect(getScheduleName(1000000, 1)).toBe("gitauto-repo-1000000-1");
    });

    it("should always maintain consistent format", () => {
      const testCases = [
        [1, 1],
        [123, 456],
        [999999, 888888],
      ];
      
      testCases.forEach(([ownerId, repoId]) => {
        const result = getScheduleName(ownerId, repoId);
        expect(result).toMatch(/^gitauto-repo-\d+-\d+$/);
      });
    });
  });
});
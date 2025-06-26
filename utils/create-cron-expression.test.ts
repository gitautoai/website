import { createCronExpression } from "./create-cron-expression";

describe("createCronExpression", () => {
  describe("with weekends included", () => {
    it("should create cron expression for daily schedule including weekends", () => {
      const result = createCronExpression("09:30", true);
      expect(result).toBe("cron(30 9 * * ? *)");
    });

    it("should handle midnight time", () => {
      const result = createCronExpression("00:00", true);
      expect(result).toBe("cron(0 0 * * ? *)");
    });

    it("should handle late evening time", () => {
      const result = createCronExpression("23:59", true);
      expect(result).toBe("cron(59 23 * * ? *)");
    });

    it("should handle single digit hours and minutes", () => {
      const result = createCronExpression("05:07", true);
      expect(result).toBe("cron(7 5 * * ? *)");
    });
  });

  describe("without weekends", () => {
    it("should create cron expression for weekdays only", () => {
      const result = createCronExpression("09:30", false);
      expect(result).toBe("cron(30 9 ? * MON-FRI *)");
    });

    it("should handle midnight time for weekdays", () => {
      const result = createCronExpression("00:00", false);
      expect(result).toBe("cron(0 0 ? * MON-FRI *)");
    });

    it("should handle noon time for weekdays", () => {
      const result = createCronExpression("12:00", false);
      expect(result).toBe("cron(0 12 ? * MON-FRI *)");
    });

    it("should handle afternoon time for weekdays", () => {
      const result = createCronExpression("15:45", false);
      expect(result).toBe("cron(45 15 ? * MON-FRI *)");
    });
  });
});
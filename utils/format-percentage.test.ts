import { formatPercentage } from "./format-percentage";

describe("formatPercentage", () => {
  describe("null values", () => {
    it("should return '-' for null (not measured)", () => {
      expect(formatPercentage(null)).toBe("-");
    });
  });

  describe("NaN values", () => {
    it("should return '-' for NaN", () => {
      expect(formatPercentage(NaN)).toBe("-");
    });
  });

  describe("positive integers", () => {
    it("should format positive integers correctly", () => {
      expect(formatPercentage(0)).toBe("0%");
      expect(formatPercentage(1)).toBe("1%");
      expect(formatPercentage(50)).toBe("50%");
      expect(formatPercentage(100)).toBe("100%");
      expect(formatPercentage(999)).toBe("999%");
    });
  });

  describe("positive decimals", () => {
    it("should floor positive decimal values", () => {
      expect(formatPercentage(0.1)).toBe("0%");
      expect(formatPercentage(0.9)).toBe("0%");
      expect(formatPercentage(1.1)).toBe("1%");
      expect(formatPercentage(1.9)).toBe("1%");
      expect(formatPercentage(50.5)).toBe("50%");
      expect(formatPercentage(99.99)).toBe("99%");
    });
  });

  describe("negative numbers", () => {
    it("should handle negative integers", () => {
      expect(formatPercentage(-1)).toBe("-1%");
      expect(formatPercentage(-50)).toBe("-50%");
      expect(formatPercentage(-100)).toBe("-100%");
    });

    it("should floor negative decimal values", () => {
      expect(formatPercentage(-0.1)).toBe("-1%");
      expect(formatPercentage(-0.9)).toBe("-1%");
      expect(formatPercentage(-1.1)).toBe("-2%");
      expect(formatPercentage(-1.9)).toBe("-2%");
      expect(formatPercentage(-50.5)).toBe("-51%");
    });
  });

  describe("edge cases", () => {
    it("should handle very large numbers", () => {
      expect(formatPercentage(1000000)).toBe("1000000%");
      expect(formatPercentage(999999.99)).toBe("999999%");
    });
  });
});

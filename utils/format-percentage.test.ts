import { formatPercentage } from "./format-percentage";

describe("formatPercentage", () => {
  describe("null values", () => {
    it("should return '0%' for null value", () => {
      expect(formatPercentage(null)).toBe("0%");
    });
  });

  describe("NaN values", () => {
    it("should return '0%' for NaN value", () => {
      expect(formatPercentage(NaN)).toBe("0%");
    });

    it("should return '0%' for values that result in NaN", () => {
      expect(formatPercentage(Number("invalid"))).toBe("0%");
      expect(formatPercentage(0 / 0)).toBe("0%");
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

  describe("negative integers", () => {
    it("should format negative integers correctly", () => {
      expect(formatPercentage(-1)).toBe("-1%");
      expect(formatPercentage(-50)).toBe("-50%");
      expect(formatPercentage(-100)).toBe("-100%");
    });
  });

  describe("positive decimals", () => {
    it("should floor positive decimal values", () => {
      expect(formatPercentage(0.1)).toBe("0%");
      expect(formatPercentage(0.9)).toBe("0%");
      expect(formatPercentage(1.1)).toBe("1%");
      expect(formatPercentage(1.9)).toBe("1%");
      expect(formatPercentage(50.1)).toBe("50%");
      expect(formatPercentage(50.5)).toBe("50%");
      expect(formatPercentage(50.9)).toBe("50%");
      expect(formatPercentage(99.99)).toBe("99%");
    });
  });

  describe("negative decimals", () => {
    it("should floor negative decimal values", () => {
      expect(formatPercentage(-0.1)).toBe("-1%");
      expect(formatPercentage(-0.9)).toBe("-1%");
      expect(formatPercentage(-1.1)).toBe("-2%");
      expect(formatPercentage(-1.9)).toBe("-2%");
      expect(formatPercentage(-50.1)).toBe("-51%");
      expect(formatPercentage(-50.5)).toBe("-51%");
      expect(formatPercentage(-50.9)).toBe("-51%");
      expect(formatPercentage(-99.99)).toBe("-100%");
    });
  });

  describe("edge cases", () => {
    it("should handle very small positive numbers", () => {
      expect(formatPercentage(0.0001)).toBe("0%");
      expect(formatPercentage(0.00001)).toBe("0%");
    });

    it("should handle very small negative numbers", () => {
      expect(formatPercentage(-0.0001)).toBe("-1%");
      expect(formatPercentage(-0.00001)).toBe("-1%");
    });

    it("should handle very large numbers", () => {
      expect(formatPercentage(1000000)).toBe("1000000%");
      expect(formatPercentage(-1000000)).toBe("-1000000%");
      expect(formatPercentage(Number.MAX_SAFE_INTEGER)).toBe("9007199254740991%");
    });
  });
});

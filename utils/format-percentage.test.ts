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
      expect(formatPercentage(Number(undefined))).toBe("0%");
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

  describe("positive decimals with floor rounding", () => {
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

  describe("negative decimals with floor rounding", () => {
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

  describe("very small values", () => {
    it("should handle very small positive values", () => {
      expect(formatPercentage(0.001)).toBe("0%");
      expect(formatPercentage(0.0001)).toBe("0%");
      expect(formatPercentage(Number.MIN_VALUE)).toBe("0%");
    });

    it("should handle very small negative values", () => {
      expect(formatPercentage(-0.001)).toBe("-1%");
      expect(formatPercentage(-0.0001)).toBe("-1%");
    });
  });

  describe("very large values", () => {
    it("should handle very large values", () => {
      expect(formatPercentage(1000)).toBe("1000%");
      expect(formatPercentage(10000)).toBe("10000%");
      expect(formatPercentage(999999.99)).toBe("999999%");
    });
  });

  describe("edge cases", () => {
    it("should handle zero correctly", () => {
      expect(formatPercentage(0)).toBe("0%");
      expect(formatPercentage(-0)).toBe("0%");
    });

    it("should handle Infinity values", () => {
      expect(formatPercentage(Infinity)).toBe("Infinity%");
      expect(formatPercentage(-Infinity)).toBe("-Infinity%");
    });
  });
});

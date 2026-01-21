 
import { generateRandomDelay } from "./generate-random-delay";

describe("generateRandomDelay", () => {
  describe("return type", () => {
    it("should return a Date object", () => {
      const result = generateRandomDelay();
      expect(result).toBeInstanceOf(Date);
    });

    it("should return a valid Date object", () => {
      const result = generateRandomDelay();
      expect(result.getTime()).not.toBeNaN();
    });
  });

  describe("time range validation", () => {
    it("should return a date in the future", () => {
      const now = Date.now();
      const result = generateRandomDelay();
      expect(result.getTime()).toBeGreaterThan(now);
    });

    it("should return a date at least 30 minutes in the future", () => {
      const now = Date.now();
      const minDelay = now + 30 * 60 * 1000; // 30 minutes in milliseconds
      const result = generateRandomDelay();
      expect(result.getTime()).toBeGreaterThanOrEqual(minDelay);
    });

    it("should return a date at most 60 minutes in the future", () => {
      const now = Date.now();
      const maxDelay = now + 60 * 60 * 1000; // 60 minutes in milliseconds
      const result = generateRandomDelay();
      expect(result.getTime()).toBeLessThanOrEqual(maxDelay);
    });

    it("should return a date within the 30-60 minute range", () => {
      const now = Date.now();
      const minDelay = now + 30 * 60 * 1000; // 30 minutes
      const maxDelay = now + 60 * 60 * 1000; // 60 minutes
      const result = generateRandomDelay();
      const resultTime = result.getTime();

      expect(resultTime).toBeGreaterThanOrEqual(minDelay);
      expect(resultTime).toBeLessThanOrEqual(maxDelay);
    });
  });

  describe("randomness", () => {
    it("should generate different delays over multiple calls", () => {
      const results = new Set<number>();

      // Generate 50 random delays
      for (let i = 0; i < 50; i++) {
        const delay = generateRandomDelay();
        results.add(delay.getTime());
      }

      // With 50 calls, we should get at least 2 different values
      // (probability of getting only 1 value is astronomically low)
      expect(results.size).toBeGreaterThan(1);
    });

    it("should potentially generate many different delays", () => {
      const results = new Set<number>();

      // Generate 100 random delays
      for (let i = 0; i < 100; i++) {
        const delay = generateRandomDelay();
        results.add(delay.getTime());
      }

      // With 100 calls on a range of 31 possible minute values,
      // we should get at least 10 different values
      expect(results.size).toBeGreaterThanOrEqual(10);
    });

    it("should distribute delays across the range", () => {
      const delays: number[] = [];

      // Generate many delays to test distribution
      for (let i = 0; i < 200; i++) {
        const delay = generateRandomDelay();
        const now = Date.now();
        const minutesFromNow = Math.floor((delay.getTime() - now) / (60 * 1000));
        delays.push(minutesFromNow);
      }

      // Check that we have delays in both the lower and upper half of the range
      const lowerHalf = delays.filter(d => d >= 30 && d < 45);
      const upperHalf = delays.filter(d => d >= 45 && d <= 60);

      // Both halves should have at least some values
      expect(lowerHalf.length).toBeGreaterThan(0);
      expect(upperHalf.length).toBeGreaterThan(0);
    });
  });

  describe("consistency", () => {
    it("should always return dates within the valid range across multiple calls", () => {
      for (let i = 0; i < 100; i++) {
        const now = Date.now();
        const result = generateRandomDelay();
        const minutesFromNow = (result.getTime() - now) / (60 * 1000);

        expect(minutesFromNow).toBeGreaterThanOrEqual(30);
        expect(minutesFromNow).toBeLessThanOrEqual(60);
      }
    });
  });
});

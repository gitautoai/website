import { generateRandomDelay } from "./generate-random-delay";

describe("generateRandomDelay", () => {
  it("returns a valid Date in the future", () => {
    const now = Date.now();
    const result = generateRandomDelay(30, 60);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeGreaterThan(now);
  });

  it("respects min and max bounds", () => {
    const toleranceMs = 100;
    for (let i = 0; i < 50; i++) {
      const now = Date.now();
      const result = generateRandomDelay(10, 20);
      const diffMs = result.getTime() - now;
      expect(diffMs).toBeGreaterThanOrEqual(10 * 60 * 1000 - toleranceMs);
      expect(diffMs).toBeLessThanOrEqual(20 * 60 * 1000 + toleranceMs);
    }
  });

  it("distributes delays across the range", () => {
    const delays: number[] = [];
    for (let i = 0; i < 200; i++) {
      const now = Date.now();
      const result = generateRandomDelay(30, 60);
      delays.push(Math.floor((result.getTime() - now) / (60 * 1000)));
    }
    const lowerHalf = delays.filter((d) => d >= 30 && d < 45);
    const upperHalf = delays.filter((d) => d >= 45 && d <= 60);
    expect(lowerHalf.length).toBeGreaterThan(0);
    expect(upperHalf.length).toBeGreaterThan(0);
  });
});

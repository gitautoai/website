import { generateRandomDelay } from "./generate-random-delay";

describe("generateRandomDelay", () => {
  let mockDateNow: jest.SpyInstance;
  let mockMathRandom: jest.SpyInstance;

  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp
    mockDateNow = jest.spyOn(Date, "now");
    // Mock Math.random() to control randomness
    mockMathRandom = jest.spyOn(Math, "random");
  });

  afterEach(() => {
    // Restore original implementations
    mockDateNow.mockRestore();
    mockMathRandom.mockRestore();
  });

  describe("minimum delay (30 minutes)", () => {
    it("should return a date 30 minutes in the future when random is 0", () => {
      const fixedNow = 1000000000000; // Fixed timestamp
      mockDateNow.mockReturnValue(fixedNow);
      mockMathRandom.mockReturnValue(0); // Math.random() returns 0

      const result = generateRandomDelay();

      expect(result).toBeInstanceOf(Date);
      const expectedTime = fixedNow + 30 * 60 * 1000; // 30 minutes in milliseconds
      expect(result.getTime()).toBe(expectedTime);
    });
  });

  describe("maximum delay (60 minutes)", () => {
    it("should return a date 60 minutes in the future when random is close to 1", () => {
      const fixedNow = 1000000000000; // Fixed timestamp
      mockDateNow.mockReturnValue(fixedNow);
      mockMathRandom.mockReturnValue(0.9999999); // Math.random() returns value close to 1

      const result = generateRandomDelay();

      expect(result).toBeInstanceOf(Date);
      const expectedTime = fixedNow + 60 * 60 * 1000; // 60 minutes in milliseconds
      expect(result.getTime()).toBe(expectedTime);
    });
  });

  describe("middle delay (45 minutes)", () => {
    it("should return a date 45 minutes in the future when random is 0.5", () => {
      const fixedNow = 1000000000000; // Fixed timestamp
      mockDateNow.mockReturnValue(fixedNow);
      mockMathRandom.mockReturnValue(0.5); // Math.random() returns 0.5

      const result = generateRandomDelay();

      expect(result).toBeInstanceOf(Date);
      const expectedTime = fixedNow + 45 * 60 * 1000; // 45 minutes in milliseconds
      expect(result.getTime()).toBe(expectedTime);
    });
  });

  describe("various random values", () => {
    it("should return a date 35 minutes in the future when random is 0.16", () => {
      const fixedNow = 1000000000000;
      mockDateNow.mockReturnValue(fixedNow);
      mockMathRandom.mockReturnValue(0.16); // Results in 35 minutes

      const result = generateRandomDelay();

      expect(result).toBeInstanceOf(Date);
      const expectedTime = fixedNow + 35 * 60 * 1000;
      expect(result.getTime()).toBe(expectedTime);
    });

    it("should return a date 55 minutes in the future when random is 0.8", () => {
      const fixedNow = 1000000000000;
      mockDateNow.mockReturnValue(fixedNow);
      mockMathRandom.mockReturnValue(0.8); // Results in 54 minutes

      const result = generateRandomDelay();

      expect(result).toBeInstanceOf(Date);
      const expectedTime = fixedNow + 54 * 60 * 1000;
      expect(result.getTime()).toBe(expectedTime);
    });
  });

  describe("return type", () => {
    it("should always return a Date object", () => {
      mockDateNow.mockReturnValue(Date.now());
      mockMathRandom.mockReturnValue(Math.random());
      expect(generateRandomDelay()).toBeInstanceOf(Date);
    });
  });
});

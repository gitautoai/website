import { generateRandomDelay } from "./generate-random-delay";

describe("generateRandomDelay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a Date object", () => {
    const result = generateRandomDelay();
    expect(result).toBeInstanceOf(Date);
  });

  it("should return a future date", () => {
    const now = new Date();
    const result = generateRandomDelay();
    
    expect(result.getTime()).toBeGreaterThan(now.getTime());
  });

  it("should return a date within the expected range (30-60 minutes)", () => {
    const now = Date.now();
    const result = generateRandomDelay();
    const delayInMs = result.getTime() - now;
    const delayInMinutes = delayInMs / (60 * 1000);
    
    expect(delayInMinutes).toBeGreaterThanOrEqual(30);
    expect(delayInMinutes).toBeLessThanOrEqual(60);
  });

  it("should generate different delays on multiple calls", () => {
    const delays = [];
    const iterations = 10;
    
    for (let i = 0; i < iterations; i++) {
      delays.push(generateRandomDelay().getTime());
    }
    
    // Check that not all delays are the same (very unlikely with random generation)
    const uniqueDelays = new Set(delays);
    expect(uniqueDelays.size).toBeGreaterThan(1);
  });

  it("should work with mocked Math.random for predictable testing", () => {
    const mockMathRandom = jest.spyOn(Math, "random");
    const mockDateNow = jest.spyOn(Date, "now");
    
    const fixedNow = 1000000000000; // Fixed timestamp
    const fixedRandom = 0.5; // This should give us 45 minutes (middle of 30-60 range)
    
    mockDateNow.mockReturnValue(fixedNow);
    mockMathRandom.mockReturnValue(fixedRandom);
    
    const result = generateRandomDelay();
    
    // With random = 0.5, we get: Math.floor(0.5 * 31) + 30 = 45 minutes
    const expectedDelayMs = 45 * 60 * 1000;
    const expectedTime = fixedNow + expectedDelayMs;
    
    expect(result.getTime()).toBe(expectedTime);
    
    mockMathRandom.mockRestore();
    mockDateNow.mockRestore();
  });

  it("should handle edge cases of Math.random (0 and close to 1)", () => {
    const mockMathRandom = jest.spyOn(Math, "random");
    const now = Date.now();
    
    // Test with Math.random() = 0 (should give 30 minutes)
    mockMathRandom.mockReturnValueOnce(0);
    const minResult = generateRandomDelay();
    const minDelayMinutes = (minResult.getTime() - now) / (60 * 1000);
    expect(Math.floor(minDelayMinutes)).toBe(30);
    
    // Test with Math.random() = 0.999... (should give close to 60 minutes)
    mockMathRandom.mockReturnValueOnce(0.999);
    const maxResult = generateRandomDelay();
    const maxDelayMinutes = (maxResult.getTime() - now) / (60 * 1000);
    expect(Math.floor(maxDelayMinutes)).toBe(60);
    
    mockMathRandom.mockRestore();
  });
});
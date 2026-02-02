/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";
import { countTokens } from "./tokens";

// Mock the js-tiktoken module
jest.mock("js-tiktoken/lite");
jest.mock("js-tiktoken/ranks/o200k_base", () => ({}));

describe("countTokens", () => {
  let mockEncode: jest.Mock;
  let mockTiktoken: jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create a mock encode function
    mockEncode = jest.fn();

    // Mock the Tiktoken constructor
    mockTiktoken = Tiktoken as jest.MockedClass<typeof Tiktoken>;
    mockTiktoken.mockImplementation(() => ({
      encode: mockEncode,
    }) as any);
  });

  describe("successful token counting", () => {
    it("should return the correct token count for a simple string", () => {
      const mockTokens = [1, 2, 3, 4, 5];
      mockEncode.mockReturnValue(mockTokens);

      const result = countTokens("Hello world");

      expect(result).toBe(5);
      expect(mockTiktoken).toHaveBeenCalledWith(o200k_base);
      expect(mockEncode).toHaveBeenCalledWith("Hello world");
    });

    it("should return 0 for an empty string", () => {
      mockEncode.mockReturnValue([]);

      const result = countTokens("");

      expect(result).toBe(0);
      expect(mockEncode).toHaveBeenCalledWith("");
    });

    it("should handle long text correctly", () => {
      const longText = "This is a much longer text that would generate more tokens";
      const mockTokens = new Array(20).fill(1);
      mockEncode.mockReturnValue(mockTokens);

      const result = countTokens(longText);

      expect(result).toBe(20);
      expect(mockEncode).toHaveBeenCalledWith(longText);
    });

    it("should handle special characters", () => {
      const specialText = "Hello! @#$%^&*() 你好";
      const mockTokens = [1, 2, 3, 4, 5, 6, 7];
      mockEncode.mockReturnValue(mockTokens);

      const result = countTokens(specialText);

      expect(result).toBe(7);
      expect(mockEncode).toHaveBeenCalledWith(specialText);
    });

    it("should handle multiline text", () => {
      const multilineText = `Line 1
Line 2
Line 3`;
      const mockTokens = [1, 2, 3, 4, 5, 6, 7, 8];
      mockEncode.mockReturnValue(mockTokens);

      const result = countTokens(multilineText);

      expect(mockEncode).toHaveBeenCalledWith(multilineText);
      expect(result).toBe(8);
    });

    it("should handle single character", () => {
      const mockTokens = [1];
      mockEncode.mockReturnValue(mockTokens);

      const result = countTokens("a");

      expect(result).toBe(1);
      expect(mockEncode).toHaveBeenCalledWith("a");
    });
  });

  describe("error handling", () => {
    it("should return 0 when Tiktoken constructor throws an error", () => {
      mockTiktoken.mockImplementation(() => {
        throw new Error("Tiktoken initialization failed");
      });

      const result = countTokens("test text");

      expect(result).toBe(0);
    });

    it("should return 0 when encode method throws an error", () => {
      mockEncode.mockImplementation(() => {
        throw new Error("Encoding failed");
      });

      const result = countTokens("test text");

      expect(result).toBe(0);
    });
  });
});

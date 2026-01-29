import { Tiktoken } from "js-tiktoken/lite";
import { countTokens } from "./tokens";

jest.mock("js-tiktoken/lite");

describe("countTokens", () => {
  let mockEncode: jest.Mock;
  let mockTiktoken: jest.Mocked<Tiktoken>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockEncode = jest.fn();
    mockTiktoken = {
      encode: mockEncode,
    } as any;

    (Tiktoken as jest.MockedClass<typeof Tiktoken>).mockImplementation(() => mockTiktoken);
  });

  describe("happy path", () => {
    it("should count tokens for simple text", () => {
      mockEncode.mockReturnValue([1, 2, 3]);

      const result = countTokens("Hello world");

      expect(result).toBe(3);
      expect(Tiktoken).toHaveBeenCalledTimes(1);
      expect(mockEncode).toHaveBeenCalledWith("Hello world");
    });

    it("should count tokens for longer text", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const result = countTokens("This is a longer sentence with more words.");

      expect(result).toBe(10);
      expect(mockEncode).toHaveBeenCalledWith("This is a longer sentence with more words.");
    });

    it("should count tokens for single word", () => {
      mockEncode.mockReturnValue([1]);

      const result = countTokens("Hello");

      expect(result).toBe(1);
      expect(mockEncode).toHaveBeenCalledWith("Hello");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      mockEncode.mockReturnValue([]);

      const result = countTokens("");

      expect(result).toBe(0);
      expect(mockEncode).toHaveBeenCalledWith("");
    });

    it("should handle whitespace only", () => {
      mockEncode.mockReturnValue([1]);

      const result = countTokens("   ");

      expect(result).toBe(1);
      expect(mockEncode).toHaveBeenCalledWith("   ");
    });

    it("should handle newlines and tabs", () => {
      mockEncode.mockReturnValue([1, 2, 3]);

      const result = countTokens("Line 1\nLine 2\tTabbed");

      expect(result).toBe(3);
      expect(mockEncode).toHaveBeenCalledWith("Line 1\nLine 2\tTabbed");
    });

    it("should handle special characters", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4]);

      const result = countTokens("!@#$%^&*()");

      expect(result).toBe(4);
      expect(mockEncode).toHaveBeenCalledWith("!@#$%^&*()");
    });

    it("should handle unicode characters", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5]);

      const result = countTokens("Hello 世界 🌍");

      expect(result).toBe(5);
      expect(mockEncode).toHaveBeenCalledWith("Hello 世界 🌍");
    });

    it("should handle very long text", () => {
      const longText = "word ".repeat(1000);
      const longArray = Array.from({ length: 2000 }, (_, i) => i);
      mockEncode.mockReturnValue(longArray);

      const result = countTokens(longText);

      expect(result).toBe(2000);
      expect(mockEncode).toHaveBeenCalledWith(longText);
    });
  });

  describe("error handling", () => {
    it("should return 0 when Tiktoken constructor throws error", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const error = new Error("Tiktoken initialization failed");
      (Tiktoken as jest.MockedClass<typeof Tiktoken>).mockImplementation(() => {
        throw error;
      });

      const result = countTokens("test text");

      expect(result).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error counting tokens:", error);
      consoleErrorSpy.mockRestore();
    });

    it("should return 0 when encode method throws error", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const error = new Error("Encoding failed");
      mockEncode.mockImplementation(() => {
        throw error;
      });

      const result = countTokens("test text");

      expect(result).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error counting tokens:", error);
      consoleErrorSpy.mockRestore();
    });
  });
});

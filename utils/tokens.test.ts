import { Tiktoken } from "js-tiktoken/lite";
import { countTokens } from "./tokens";

jest.mock("js-tiktoken/lite");

const mockEncode = jest.fn();

describe("countTokens", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Tiktoken as jest.MockedClass<typeof Tiktoken>).mockImplementation(
      () =>
        ({
          encode: mockEncode,
        }) as any,
    );
  });

  describe("basic text", () => {
    it("should count tokens for simple text", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5]);

      const result = countTokens("Hello world");

      expect(result).toBe(5);
      expect(mockEncode).toHaveBeenCalledWith("Hello world");
    });

    it("should count tokens for single word", () => {
      mockEncode.mockReturnValue([1, 2]);

      const result = countTokens("Hello");

      expect(result).toBe(2);
      expect(mockEncode).toHaveBeenCalledWith("Hello");
    });

    it("should count tokens for sentence with punctuation", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5, 6, 7]);

      const result = countTokens("Hello, how are you?");

      expect(result).toBe(7);
      expect(mockEncode).toHaveBeenCalledWith("Hello, how are you?");
    });
  });

  describe("empty and whitespace", () => {
    it("should return 0 for empty string", () => {
      mockEncode.mockReturnValue([]);

      const result = countTokens("");

      expect(result).toBe(0);
      expect(mockEncode).toHaveBeenCalledWith("");
    });

    it("should count tokens for whitespace only", () => {
      mockEncode.mockReturnValue([1]);

      const result = countTokens("   ");

      expect(result).toBe(1);
      expect(mockEncode).toHaveBeenCalledWith("   ");
    });

    it("should count tokens for newlines", () => {
      mockEncode.mockReturnValue([1, 2]);

      const result = countTokens("\n\n");

      expect(result).toBe(2);
      expect(mockEncode).toHaveBeenCalledWith("\n\n");
    });

    it("should count tokens for tabs", () => {
      mockEncode.mockReturnValue([1, 2]);

      const result = countTokens("\t\t");

      expect(result).toBe(2);
      expect(mockEncode).toHaveBeenCalledWith("\t\t");
    });
  });

  describe("special characters", () => {
    it("should count tokens for text with emojis", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5]);

      const result = countTokens("Hello 👋 World 🌍");

      expect(result).toBe(5);
      expect(mockEncode).toHaveBeenCalledWith("Hello 👋 World 🌍");
    });

    it("should count tokens for text with unicode characters", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4]);

      const result = countTokens("こんにちは世界");

      expect(result).toBe(4);
      expect(mockEncode).toHaveBeenCalledWith("こんにちは世界");
    });

    it("should count tokens for text with special symbols", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5, 6]);

      const result = countTokens("@#$%^&*()");

      expect(result).toBe(6);
      expect(mockEncode).toHaveBeenCalledWith("@#$%^&*()");
    });

    it("should count tokens for text with accented characters", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4]);

      const result = countTokens("café résumé");

      expect(result).toBe(4);
      expect(mockEncode).toHaveBeenCalledWith("café résumé");
    });
  });

  describe("long text", () => {
    it("should count tokens for paragraph", () => {
      const longText =
        "This is a longer paragraph with multiple sentences. It contains various words and punctuation marks. The token count should reflect the complexity of the text.";
      mockEncode.mockReturnValue(new Array(30).fill(1));

      const result = countTokens(longText);

      expect(result).toBe(30);
      expect(mockEncode).toHaveBeenCalledWith(longText);
    });

    it("should count tokens for very long text", () => {
      const veryLongText = "word ".repeat(1000);
      mockEncode.mockReturnValue(new Array(2000).fill(1));

      const result = countTokens(veryLongText);

      expect(result).toBe(2000);
      expect(mockEncode).toHaveBeenCalledWith(veryLongText);
    });
  });

  describe("code and structured content", () => {
    it("should count tokens for code snippet", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8]);

      const result = countTokens('function hello() { return "world"; }');

      expect(result).toBe(8);
      expect(mockEncode).toHaveBeenCalledWith('function hello() { return "world"; }');
    });

    it("should count tokens for JSON string", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5]);

      const result = countTokens('{"name": "John", "age": 30}');

      expect(result).toBe(5);
      expect(mockEncode).toHaveBeenCalledWith('{"name": "John", "age": 30}');
    });

    it("should count tokens for markdown text", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5, 6]);

      const result = countTokens("# Heading\n\n**Bold** text");

      expect(result).toBe(6);
      expect(mockEncode).toHaveBeenCalledWith("# Heading\n\n**Bold** text");
    });

    it("should count tokens for HTML string", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5]);

      const result = countTokens("<div>Hello <strong>World</strong></div>");

      expect(result).toBe(5);
      expect(mockEncode).toHaveBeenCalledWith("<div>Hello <strong>World</strong></div>");
    });
  });

  describe("mixed content", () => {
    it("should count tokens for text with numbers", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5, 6]);

      const result = countTokens("I have 123 apples and 456 oranges");

      expect(result).toBe(6);
      expect(mockEncode).toHaveBeenCalledWith("I have 123 apples and 456 oranges");
    });

    it("should count tokens for text with URLs", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5]);

      const result = countTokens("Visit https://example.com for more info");

      expect(result).toBe(5);
      expect(mockEncode).toHaveBeenCalledWith("Visit https://example.com for more info");
    });

    it("should count tokens for text with email addresses", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4]);

      const result = countTokens("Contact us at support@example.com");

      expect(result).toBe(4);
      expect(mockEncode).toHaveBeenCalledWith("Contact us at support@example.com");
    });

    it("should count tokens for text with currency symbols", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5, 6]);

      const result = countTokens("Price: $99.99 for 2 items");

      expect(result).toBe(6);
      expect(mockEncode).toHaveBeenCalledWith("Price: $99.99 for 2 items");
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

    it("should handle different error types", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const error = new TypeError("Invalid input");
      mockEncode.mockImplementation(() => {
        throw error;
      });

      const result = countTokens("test");

      expect(result).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error counting tokens:", error);
      consoleErrorSpy.mockRestore();
    });

    it("should handle string errors", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      mockEncode.mockImplementation(() => {
        throw "String error";
      });

      const result = countTokens("test");

      expect(result).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error counting tokens:", "String error");
      consoleErrorSpy.mockRestore();
    });
  });

  describe("edge cases", () => {
    it("should count tokens for text with only punctuation", () => {
      mockEncode.mockReturnValue([1, 2, 3]);

      const result = countTokens("...");

      expect(result).toBe(3);
      expect(mockEncode).toHaveBeenCalledWith("...");
    });

    it("should count tokens for text with repeated characters", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5]);

      const result = countTokens("aaaaa");

      expect(result).toBe(5);
      expect(mockEncode).toHaveBeenCalledWith("aaaaa");
    });

    it("should count tokens for text with line breaks", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4, 5]);

      const result = countTokens("Line 1\nLine 2\nLine 3");

      expect(result).toBe(5);
      expect(mockEncode).toHaveBeenCalledWith("Line 1\nLine 2\nLine 3");
    });

    it("should count tokens for text with mixed whitespace", () => {
      mockEncode.mockReturnValue([1, 2, 3, 4]);

      const result = countTokens("word1  \t  word2\n\nword3");

      expect(result).toBe(4);
      expect(mockEncode).toHaveBeenCalledWith("word1  \t  word2\n\nword3");
    });
  });
});

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { validateLength } from "./validation";

describe("validateLength", () => {
  describe("valid text within bounds", () => {
    it("should not throw for text within min and max length", () => {
      expect(() => validateLength("Hello", "Title", 1, 10)).not.toThrow();
      expect(() => validateLength("Test", "Description", 1, 100)).not.toThrow();
      expect(() => validateLength("Valid content", "Content", 5, 50)).not.toThrow();
    });
  });

  describe("text at exact boundaries", () => {
    it("should not throw for text exactly at minLength", () => {
      expect(() => validateLength("Hi", "Title", 2, 10)).not.toThrow();
      expect(() => validateLength("A", "Name", 1, 5)).not.toThrow();
      expect(() => validateLength("12345", "Code", 5, 10)).not.toThrow();
    });

    it("should not throw for text exactly at maxLength", () => {
      expect(() => validateLength("Hello", "Title", 1, 5)).not.toThrow();
      expect(() => validateLength("Test", "Name", 1, 4)).not.toThrow();
      expect(() => validateLength("1234567890", "Code", 5, 10)).not.toThrow();
    });
  });

  describe("text too short", () => {
    it("should throw error when text length is less than minLength", () => {
      expect(() => validateLength("Hi", "Title", 5, 10)).toThrow(
        'Title length violation: 2 characters. Must be between 5-10 characters according to Ahrefs.\nText: "Hi"'
      );
    });

    it("should throw error for empty string when minLength is greater than 0", () => {
      expect(() => validateLength("", "Description", 10, 100)).toThrow(
        'Description length violation: 0 characters. Must be between 10-100 characters according to Ahrefs.\nText: ""'
      );
    });

    it("should throw error when text is one character short", () => {
      expect(() => validateLength("Test", "Content", 5, 20)).toThrow(
        'Content length violation: 4 characters. Must be between 5-20 characters according to Ahrefs.\nText: "Test"'
      );
    });
  });

  describe("text too long", () => {
    it("should throw error when text length exceeds maxLength", () => {
      expect(() => validateLength("This is a very long text", "Title", 1, 10)).toThrow(
        'Title length violation: 24 characters. Must be between 1-10 characters according to Ahrefs.\nText: "This is a very long text"'
      );
    });

    it("should throw error when text is one character too long", () => {
      expect(() => validateLength("Hello!", "Name", 1, 5)).toThrow(
        'Name length violation: 6 characters. Must be between 1-5 characters according to Ahrefs.\nText: "Hello!"'
      );
    });

    it("should throw error for very long text", () => {
      const longText = "a".repeat(200);
      expect(() => validateLength(longText, "Description", 10, 100)).toThrow(
        `Description length violation: 200 characters. Must be between 10-100 characters according to Ahrefs.\nText: "${longText}"`
      );
    });
  });

  describe("empty string edge cases", () => {
    it("should not throw for empty string when minLength is 0", () => {
      expect(() => validateLength("", "Optional", 0, 10)).not.toThrow();
    });

    it("should throw for empty string when minLength is 1", () => {
      expect(() => validateLength("", "Required", 1, 10)).toThrow(
        'Required length violation: 0 characters. Must be between 1-10 characters according to Ahrefs.\nText: ""'
      );
    });
  });

  describe("single character text", () => {
    it("should not throw for single character when within bounds", () => {
      expect(() => validateLength("A", "Initial", 1, 1)).not.toThrow();
      expect(() => validateLength("X", "Letter", 1, 5)).not.toThrow();
    });

    it("should throw for single character when minLength is greater", () => {
      expect(() => validateLength("A", "Name", 2, 10)).toThrow(
        'Name length violation: 1 characters. Must be between 2-10 characters according to Ahrefs.\nText: "A"'
      );
    });
  });

  describe("special characters and unicode", () => {
    it("should handle special characters correctly", () => {
      expect(() => validateLength("Hello@#$%", "Password", 5, 20)).not.toThrow();
      expect(() => validateLength("Test\nNew\nLine", "Content", 5, 20)).not.toThrow();
    });

    it("should handle unicode characters correctly", () => {
      expect(() => validateLength("Hello 世界", "Title", 5, 20)).not.toThrow();
      expect(() => validateLength("🎉🎊🎈", "Emoji", 1, 10)).not.toThrow();
    });

    it("should count unicode characters by length", () => {
      const emojiText = "🎉🎊🎈";
      expect(() => validateLength(emojiText, "Emoji", 1, 2)).toThrow();
    });
  });

  describe("different field names", () => {
    it("should include field name in error message", () => {
      expect(() => validateLength("Hi", "Meta Title", 10, 60)).toThrow(/Meta Title length violation/);
      expect(() => validateLength("Short", "Meta Description", 50, 160)).toThrow(/Meta Description length violation/);
      expect(() => validateLength("X", "SEO Heading", 20, 70)).toThrow(/SEO Heading length violation/);
    });
  });
});

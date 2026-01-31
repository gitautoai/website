import { validateLength } from "./validation";

describe("validateLength", () => {
  describe("valid text within bounds", () => {
    it("should not throw for text within min and max length", () => {
      expect(() => validateLength("Hello", "Title", 1, 10)).not.toThrow();
      expect(() => validateLength("Test", "Description", 1, 100)).not.toThrow();
      expect(() => validateLength("Valid content", "Content", 5, 50)).not.toThrow();
    });

    it("should not throw for text exactly at minimum length", () => {
      expect(() => validateLength("a", "Field", 1, 10)).not.toThrow();
      expect(() => validateLength("abc", "Field", 3, 10)).not.toThrow();
      expect(() => validateLength("12345", "Field", 5, 20)).not.toThrow();
    });

    it("should not throw for text exactly at maximum length", () => {
      expect(() => validateLength("a", "Field", 1, 1)).not.toThrow();
      expect(() => validateLength("abc", "Field", 1, 3)).not.toThrow();
      expect(() => validateLength("12345", "Field", 1, 5)).not.toThrow();
    });

    it("should not throw for text at both min and max when they are equal", () => {
      expect(() => validateLength("exact", "Field", 5, 5)).not.toThrow();
      expect(() => validateLength("a", "Field", 1, 1)).not.toThrow();
    });
  });

  describe("text too short", () => {
    it("should throw error when text is shorter than minimum length", () => {
      expect(() => validateLength("", "Title", 1, 10)).toThrow(
        'Title length violation: 0 characters. Must be between 1-10 characters according to Ahrefs.\nText: ""'
      );
    });

    it("should throw error with correct message for various short texts", () => {
      expect(() => validateLength("ab", "Description", 5, 100)).toThrow(
        'Description length violation: 2 characters. Must be between 5-100 characters according to Ahrefs.\nText: "ab"'
      );

      expect(() => validateLength("test", "Content", 10, 50)).toThrow(
        'Content length violation: 4 characters. Must be between 10-50 characters according to Ahrefs.\nText: "test"'
      );
    });

    it("should throw error when text is one character short", () => {
      expect(() => validateLength("1234", "Field", 5, 10)).toThrow(
        'Field length violation: 4 characters. Must be between 5-10 characters according to Ahrefs.\nText: "1234"'
      );
    });
  });

  describe("text too long", () => {
    it("should throw error when text is longer than maximum length", () => {
      expect(() => validateLength("This is too long", "Title", 1, 10)).toThrow(
        'Title length violation: 16 characters. Must be between 1-10 characters according to Ahrefs.\nText: "This is too long"'
      );
    });

    it("should throw error with correct message for various long texts", () => {
      expect(() => validateLength("This is a very long description that exceeds the limit", "Description", 5, 20)).toThrow(
        'Description length violation: 55 characters. Must be between 5-20 characters according to Ahrefs.\nText: "This is a very long description that exceeds the limit"'
      );
    });

    it("should throw error when text is one character too long", () => {
      expect(() => validateLength("123456", "Field", 1, 5)).toThrow(
        'Field length violation: 6 characters. Must be between 1-5 characters according to Ahrefs.\nText: "123456"'
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty string with zero minimum", () => {
      expect(() => validateLength("", "Field", 0, 10)).not.toThrow();
    });

    it("should throw for empty string when minimum is greater than zero", () => {
      expect(() => validateLength("", "Field", 1, 10)).toThrow(
        'Field length violation: 0 characters. Must be between 1-10 characters according to Ahrefs.\nText: ""'
      );
    });

    it("should handle very large maximum values", () => {
      const longText = "a".repeat(1000);
      expect(() => validateLength(longText, "Field", 1, 10000)).not.toThrow();
    });

    it("should handle special characters in text", () => {
      expect(() => validateLength("Hello! @#$%", "Field", 5, 20)).not.toThrow();
      expect(() => validateLength("Line1\nLine2", "Field", 5, 20)).not.toThrow();
      expect(() => validateLength("Tab\there", "Field", 5, 20)).not.toThrow();
    });

    it("should handle unicode characters correctly", () => {
      expect(() => validateLength("Hello 世界", "Field", 5, 20)).not.toThrow();
      expect(() => validateLength("🎉🎊", "Field", 1, 5)).not.toThrow();
    });

    it("should include the actual text in error message", () => {
      expect(() => validateLength("Short", "Title", 10, 100)).toThrow(
        'Title length violation: 5 characters. Must be between 10-100 characters according to Ahrefs.\nText: "Short"'
      );
    });
  });
});

 
import { parseName } from "./parse-name";

describe("parseName", () => {
  describe("single name", () => {
    it("should handle a single name", () => {
      const result = parseName("John");
      expect(result).toEqual({
        firstName: "John",
        lastName: "John",
      });
    });

    it("should handle a single name with leading/trailing spaces", () => {
      const result = parseName("  John  ");
      expect(result).toEqual({
        firstName: "John",
        lastName: "John",
      });
    });
  });

  describe("full name with first and last", () => {
    it("should parse a simple first and last name", () => {
      const result = parseName("John Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle names with extra spaces", () => {
      const result = parseName("John   Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle names with leading and trailing spaces", () => {
      const result = parseName("  John Doe  ");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  describe("full name with middle names", () => {
    it("should parse first, middle, and last name", () => {
      const result = parseName("John Michael Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should parse multiple middle names", () => {
      const result = parseName("John Michael James Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  describe("names with parentheses", () => {
    it("should remove content in parentheses", () => {
      const result = parseName("John (Johnny) Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should remove multiple parentheses", () => {
      const result = parseName("John (Johnny) Michael (Mike) Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle parentheses at the beginning", () => {
      const result = parseName("(Mr.) John Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle parentheses at the end", () => {
      const result = parseName("John Doe (Jr.)");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle only parentheses content", () => {
      const result = parseName("(Nickname)");
      expect(result).toEqual({
        firstName: "(Nickname)",
        lastName: "",
      });
    });

    it("should handle name with spaces around parentheses", () => {
      const result = parseName("John  (Johnny)  Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const result = parseName("");
      expect(result).toEqual({
        firstName: "",
        lastName: "",
      });
    });

    it("should handle string with only spaces", () => {
      const result = parseName("   ");
      expect(result).toEqual({
        firstName: "   ",
        lastName: "",
      });
    });

    it("should handle string with only parentheses", () => {
      const result = parseName("()");
      expect(result).toEqual({
        firstName: "()",
        lastName: "",
      });
    });

    it("should handle string with spaces and parentheses", () => {
      const result = parseName("  (test)  ");
      expect(result).toEqual({
        firstName: "  (test)  ",
        lastName: "",
      });
    });
  });

  describe("special characters", () => {
    it("should handle hyphenated names", () => {
      const result = parseName("Mary-Jane Watson");
      expect(result).toEqual({
        firstName: "Mary-Jane",
        lastName: "Watson",
      });
    });

    it("should handle apostrophes", () => {
      const result = parseName("O'Brien Smith");
      expect(result).toEqual({
        firstName: "O'Brien",
        lastName: "Smith",
      });
    });

    it("should handle names with dots", () => {
      const result = parseName("Dr. John Doe");
      expect(result).toEqual({
        firstName: "Dr.",
        lastName: "Doe",
      });
    });

    it("should handle names with commas", () => {
      const result = parseName("Doe, John");
      expect(result).toEqual({
        firstName: "Doe,",
        lastName: "John",
      });
    });
  });

  describe("unicode and international names", () => {
    it("should handle names with accents", () => {
      const result = parseName("José García");
      expect(result).toEqual({
        firstName: "José",
        lastName: "García",
      });
    });

    it("should handle names with umlauts", () => {
      const result = parseName("Müller Schmidt");
      expect(result).toEqual({
        firstName: "Müller",
        lastName: "Schmidt",
      });
    });

    it("should handle Chinese names", () => {
      const result = parseName("李 明");
      expect(result).toEqual({
        firstName: "李",
        lastName: "明",
      });
    });

    it("should handle Arabic names", () => {
      const result = parseName("محمد علي");
      expect(result).toEqual({
        firstName: "محمد",
        lastName: "علي",
      });
    });
  });

  describe("corner cases", () => {
    it("should handle very long names", () => {
      const longName = "John Michael James Robert William David Richard Charles Joseph Thomas";
      const result = parseName(longName);
      expect(result).toEqual({
        firstName: "John",
        lastName: "Thomas",
      });
    });

    it("should handle single character name", () => {
      const result = parseName("J");
      expect(result).toEqual({
        firstName: "J",
        lastName: "J",
      });
    });

    it("should handle two single character names", () => {
      const result = parseName("J D");
      expect(result).toEqual({
        firstName: "J",
        lastName: "D",
      });
    });

    it("should handle name with multiple consecutive spaces", () => {
      const result = parseName("John     Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle name with tabs", () => {
      const result = parseName("John\tDoe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle name with newlines", () => {
      const result = parseName("John\nDoe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle mixed whitespace", () => {
      const result = parseName("John \t\n Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  describe("branch coverage for fallback values", () => {
    it("should use fullName as firstName when nameParts[0] is undefined", () => {
      // This happens when the string becomes empty after processing
      const result = parseName("");
      expect(result.firstName).toBe("");
    });

    it("should use empty string as lastName when last element is undefined", () => {
      const result = parseName("");
      expect(result.lastName).toBe("");
    });

    it("should handle case where trim results in empty string", () => {
      const result = parseName("   ");
      // After trim, split will create an array with one empty string
      // nameParts[0] will be "" (falsy), so it falls back to fullName "   "
      expect(result.firstName).toBe("   ");
      expect(result.lastName).toBe("");
    });
  });

  describe("parentheses edge cases", () => {
    it("should handle nested parentheses", () => {
      const result = parseName("John (Nick (Johnny)) Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle unmatched opening parenthesis", () => {
      const result = parseName("John (Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "(Doe",
      });
    });

    it("should handle unmatched closing parenthesis", () => {
      const result = parseName("John Doe)");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe)",
      });
    });

    it("should handle empty parentheses", () => {
      const result = parseName("John () Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle multiple spaces in parentheses", () => {
      const result = parseName("John (  test  ) Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });
  });
});

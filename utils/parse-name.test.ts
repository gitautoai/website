import { parseName } from "./parse-name";

describe("parseName", () => {
  describe("single name", () => {
    it("should handle a single name as both first and last name", () => {
      const result = parseName("John");
      expect(result).toEqual({
        firstName: "John",
        lastName: "John",
      });
    });

    it("should handle a single name with leading/trailing spaces", () => {
      const result = parseName("  Alice  ");
      expect(result).toEqual({
        firstName: "Alice",
        lastName: "Alice",
      });
    });
  });

  describe("full names", () => {
    it("should parse a standard first and last name", () => {
      const result = parseName("John Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should parse a name with three parts", () => {
      const result = parseName("John Michael Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should parse a name with four parts", () => {
      const result = parseName("Mary Jane Elizabeth Smith");
      expect(result).toEqual({
        firstName: "Mary",
        lastName: "Smith",
      });
    });

    it("should handle multiple spaces between names", () => {
      const result = parseName("John    Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle leading and trailing spaces", () => {
      const result = parseName("  John Doe  ");
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

    it("should handle name with only parentheses content", () => {
      const result = parseName("(Nickname)");
      expect(result).toEqual({
        firstName: "(Nickname)",
        lastName: "",
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

    it("should handle string with spaces and parentheses only", () => {
      const result = parseName("  (test)  ");
      expect(result).toEqual({
        firstName: "  (test)  ",
        lastName: "",
      });
    });
  });

  describe("special characters", () => {
    it("should handle names with hyphens", () => {
      const result = parseName("Mary-Jane Smith-Johnson");
      expect(result).toEqual({
        firstName: "Mary-Jane",
        lastName: "Smith-Johnson",
      });
    });

    it("should handle names with apostrophes", () => {
      const result = parseName("O'Brien D'Angelo");
      expect(result).toEqual({
        firstName: "O'Brien",
        lastName: "D'Angelo",
      });
    });

    it("should handle names with periods", () => {
      const result = parseName("Dr. John A. Doe");
      expect(result).toEqual({
        firstName: "Dr.",
        lastName: "Doe",
      });
    });

    it("should handle names with accents", () => {
      const result = parseName("José García");
      expect(result).toEqual({
        firstName: "José",
        lastName: "García",
      });
    });

    it("should handle names with unicode characters", () => {
      const result = parseName("李明 王");
      expect(result).toEqual({
        firstName: "李明",
        lastName: "王",
      });
    });
  });

  describe("corner cases", () => {
    it("should handle very long names", () => {
      const result = parseName("John Michael Christopher Alexander Benjamin Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should handle single character names", () => {
      const result = parseName("A B");
      expect(result).toEqual({
        firstName: "A",
        lastName: "B",
      });
    });

    it("should handle single character name", () => {
      const result = parseName("X");
      expect(result).toEqual({
        firstName: "X",
        lastName: "X",
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
  });
});

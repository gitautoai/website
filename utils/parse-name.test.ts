import { parseName } from "./parse-name";

describe("parseName", () => {
  it("should parse a simple first and last name", () => {
    const result = parseName("John Doe");
    
    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  it("should handle single name as first name", () => {
    const result = parseName("John");
    
    expect(result).toEqual({
      firstName: "John",
      lastName: "",
    });
  });

  it("should handle multiple middle names", () => {
    const result = parseName("John Michael David Smith");
    
    expect(result).toEqual({
      firstName: "John",
      lastName: "Smith",
    });
  });

  it("should handle names with parentheses", () => {
    const result = parseName("John (Johnny) Doe");
    
    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  it("should handle names with multiple parentheses", () => {
    const result = parseName("John (Johnny) Michael (Mike) Smith");
    
    expect(result).toEqual({
      firstName: "John",
      lastName: "Smith",
    });
  });

  it("should handle empty string", () => {
    const result = parseName("");
    
    expect(result).toEqual({
      firstName: "",
      lastName: "",
    });
  });

  it("should handle names with extra whitespace", () => {
    const result = parseName("  John   Doe  ");
    
    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  it("should handle names with parentheses and extra whitespace", () => {
    const result = parseName("  John  (Johnny)   Michael   Doe  ");
    
    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  it("should return original name as firstName when parsing fails", () => {
    const result = parseName("John (incomplete parentheses");
    
    expect(result.firstName).toBe("John");
    expect(result.lastName).toBe("parentheses");
  });
});

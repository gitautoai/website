import { getLevelStyle } from "./get-level-style";

describe("getLevelStyle", () => {
  describe("happy path", () => {
    it("should return 'bg-blue-50' for repository level", () => {
      // Verify that repository level returns the blue background class
      expect(getLevelStyle("repository")).toBe("bg-blue-50");
    });

    it("should return 'bg-green-50' for directory level", () => {
      // Verify that directory level returns the green background class
      expect(getLevelStyle("directory")).toBe("bg-green-50");
    });

    it("should return an empty string for file level", () => {
      // Verify that file level returns no background class
      expect(getLevelStyle("file")).toBe("");
    });
  });

  describe("edge cases", () => {
    it("should return an empty string for unknown levels", () => {
      // Verify that any unrecognized level returns an empty string
      expect(getLevelStyle("unknown")).toBe("");
      expect(getLevelStyle("something-else")).toBe("");
    });

    it("should return an empty string for empty string input", () => {
      // Verify that an empty string input returns an empty string
      expect(getLevelStyle("")).toBe("");
    });

    it("should be case-sensitive and return empty string for capitalized levels", () => {
      // Verify that the function is case-sensitive and doesn't match "Repository"
      expect(getLevelStyle("Repository")).toBe("");
      expect(getLevelStyle("DIRECTORY")).toBe("");
      expect(getLevelStyle("File")).toBe("");
    });

    it("should return empty string for levels with whitespace", () => {
      // Verify that levels with leading/trailing whitespace are not matched
      expect(getLevelStyle(" repository ")).toBe("");
      expect(getLevelStyle("directory ")).toBe("");
    });
  });

  describe("adversarial cases", () => {
    it("should handle non-string inputs gracefully if passed via JS", () => {
      // @ts-expect-error - testing runtime behavior for non-TS environments
      expect(getLevelStyle(null)).toBe("");
      // @ts-expect-error - testing runtime behavior for non-TS environments
      expect(getLevelStyle(undefined)).toBe("");
      // @ts-expect-error - testing runtime behavior for non-TS environments
      expect(getLevelStyle(123)).toBe("");
    });
  });
});

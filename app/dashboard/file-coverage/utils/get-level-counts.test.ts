 
import { Tables } from "@/types/supabase";
import { getLevelCounts } from "./get-level-counts";

describe("getLevelCounts", () => {
  describe("happy path", () => {
    it("should count items with repository level", () => {
      const data: Tables<"coverages">[] = [
        { level: "repository" } as Tables<"coverages">,
        { level: "repository" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 2,
        directory: 0,
        file: 0,
      });
    });

    it("should count items with directory level", () => {
      const data: Tables<"coverages">[] = [
        { level: "directory" } as Tables<"coverages">,
        { level: "directory" } as Tables<"coverages">,
        { level: "directory" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 0,
        directory: 3,
        file: 0,
      });
    });

    it("should count items with file level", () => {
      const data: Tables<"coverages">[] = [
        { level: "file" } as Tables<"coverages">,
        { level: "file" } as Tables<"coverages">,
        { level: "file" } as Tables<"coverages">,
        { level: "file" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 0,
        directory: 0,
        file: 4,
      });
    });

    it("should count items with mixed levels", () => {
      const data: Tables<"coverages">[] = [
        { level: "repository" } as Tables<"coverages">,
        { level: "directory" } as Tables<"coverages">,
        { level: "file" } as Tables<"coverages">,
        { level: "repository" } as Tables<"coverages">,
        { level: "file" } as Tables<"coverages">,
        { level: "file" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 2,
        directory: 1,
        file: 3,
      });
    });

    it("should handle large datasets", () => {
      const data: Tables<"coverages">[] = [
        ...Array(100).fill({ level: "repository" } as Tables<"coverages">),
        ...Array(200).fill({ level: "directory" } as Tables<"coverages">),
        ...Array(300).fill({ level: "file" } as Tables<"coverages">),
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 100,
        directory: 200,
        file: 300,
      });
    });
  });

  describe("edge cases", () => {
    it("should return zero counts for empty array", () => {
      const data: Tables<"coverages">[] = [];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 0,
        directory: 0,
        file: 0,
      });
    });

    it("should ignore items with invalid level", () => {
      const data: Tables<"coverages">[] = [
        { level: "invalid" } as Tables<"coverages">,
        { level: "unknown" } as Tables<"coverages">,
        { level: "other" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 0,
        directory: 0,
        file: 0,
      });
    });

    it("should count only valid levels when mixed with invalid levels", () => {
      const data: Tables<"coverages">[] = [
        { level: "repository" } as Tables<"coverages">,
        { level: "invalid" } as Tables<"coverages">,
        { level: "directory" } as Tables<"coverages">,
        { level: "unknown" } as Tables<"coverages">,
        { level: "file" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 1,
        directory: 1,
        file: 1,
      });
    });

    it("should handle items with empty string level", () => {
      const data: Tables<"coverages">[] = [
        { level: "" } as Tables<"coverages">,
        { level: "repository" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 1,
        directory: 0,
        file: 0,
      });
    });

    it("should handle single item array", () => {
      const data: Tables<"coverages">[] = [
        { level: "repository" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 1,
        directory: 0,
        file: 0,
      });
    });
  });

  describe("corner cases", () => {
    it("should handle items with case-sensitive levels", () => {
      const data: Tables<"coverages">[] = [
        { level: "Repository" } as Tables<"coverages">,
        { level: "DIRECTORY" } as Tables<"coverages">,
        { level: "File" } as Tables<"coverages">,
        { level: "repository" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 1,
        directory: 0,
        file: 0,
      });
    });

    it("should handle items with whitespace in level", () => {
      const data: Tables<"coverages">[] = [
        { level: " repository " } as Tables<"coverages">,
        { level: "repository" } as Tables<"coverages">,
      ];

      const result = getLevelCounts(data);

      expect(result).toEqual({
        repository: 1,
        directory: 0,
        file: 0,
      });
    });
  });
});

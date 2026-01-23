import { getRandomItem } from "./get-random-item";

describe("getRandomItem", () => {
  describe("single item array", () => {
    it("should return the only item in a single-item array", () => {
      const items = ["only-item"];
      expect(getRandomItem(items)).toBe("only-item");
    });

    it("should return the only number in a single-item array", () => {
      const items = [42];
      expect(getRandomItem(items)).toBe(42);
    });

    it("should return the only object in a single-item array", () => {
      const items = [{ id: 1, name: "test" }];
      expect(getRandomItem(items)).toEqual({ id: 1, name: "test" });
    });
  });

  describe("multiple items array", () => {
    it("should return an item from the array", () => {
      const items = ["apple", "banana", "cherry"];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should return a number from the array", () => {
      const items = [1, 2, 3, 4, 5];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should return an object from the array", () => {
      const items = [
        { id: 1, name: "first" },
        { id: 2, name: "second" },
        { id: 3, name: "third" },
      ];
      const result = getRandomItem(items);
      expect(items).toContainEqual(result);
    });
  });

  describe("different data types", () => {
    it("should work with string arrays", () => {
      const items = ["a", "b", "c"];
      const result = getRandomItem(items);
      expect(typeof result).toBe("string");
      expect(items).toContain(result);
    });

    it("should work with number arrays", () => {
      const items = [10, 20, 30];
      const result = getRandomItem(items);
      expect(typeof result).toBe("number");
      expect(items).toContain(result);
    });

    it("should work with boolean arrays", () => {
      const items = [true, false];
      const result = getRandomItem(items);
      expect(typeof result).toBe("boolean");
      expect(items).toContain(result);
    });

    it("should work with mixed type arrays", () => {
      const items = [1, "two", true, null, undefined];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should work with object arrays", () => {
      const items = [
        { type: "user", id: 1 },
        { type: "admin", id: 2 },
      ];
      const result = getRandomItem(items);
      expect(items).toContainEqual(result);
    });

    it("should work with nested arrays", () => {
      const items = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      const result = getRandomItem(items);
      expect(items).toContainEqual(result);
    });
  });

  describe("randomness", () => {
    it("should be able to return different items over multiple calls", () => {
      const items = ["a", "b", "c", "d", "e"];
      const results = new Set<string>();

      for (let i = 0; i < 100; i++) {
        results.add(getRandomItem(items));
      }

      expect(results.size).toBeGreaterThan(1);
    });

    it("should potentially return all items given enough calls", () => {
      const items = [1, 2, 3];
      const results = new Set<number>();

      for (let i = 0; i < 1000; i++) {
        results.add(getRandomItem(items));
      }

      expect(results.size).toBe(3);
    });
  });

  describe("edge cases", () => {
    it("should handle empty array", () => {
      const items: string[] = [];
      const result = getRandomItem(items);
      expect(result).toBeUndefined();
    });
  });

  describe("deterministic behavior with mocked Math.random", () => {
    let mockRandom: jest.SpyInstance;

    afterEach(() => {
      if (mockRandom) {
        mockRandom.mockRestore();
      }
    });

    it("should return the first item when Math.random returns 0", () => {
      const items = ["first", "second", "third"];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0);

      const result = getRandomItem(items);

      expect(result).toBe("first");
    });

    it("should return the last item when Math.random returns close to 1", () => {
      const items = ["first", "second", "third"];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.999);

      const result = getRandomItem(items);

      expect(result).toBe("third");
    });

    it("should return the middle item when Math.random returns 0.5", () => {
      const items = ["first", "second", "third"];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.5);

      const result = getRandomItem(items);

      expect(result).toBe("second");
    });

    it("should correctly calculate index with Math.floor", () => {
      const items = [10, 20, 30, 40, 50];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.6);

      const result = getRandomItem(items);

      expect(result).toBe(40);
    });

    it("should handle array access with calculated index", () => {
      const items = ["a", "b", "c", "d"];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.25);

      const result = getRandomItem(items);

      expect(result).toBe("b");
    });

    it("should handle fractional index calculation", () => {
      const items = [100, 200, 300];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.33);

      const result = getRandomItem(items);

      expect(result).toBe(100);
    });

    it("should handle two-item array with Math.random = 0.5", () => {
      const items = ["first", "second"];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.5);

      const result = getRandomItem(items);

      expect(result).toBe("second");
    });

    it("should handle large array with specific random value", () => {
      const items = Array.from({ length: 100 }, (_, i) => i);
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.75);

      const result = getRandomItem(items);

      expect(result).toBe(75);
    });

    it("should verify Math.random is called exactly once", () => {
      const items = [1, 2, 3];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.5);

      getRandomItem(items);

      expect(mockRandom).toHaveBeenCalledTimes(1);
    });

    it("should verify Math.floor is applied to the product", () => {
      const items = ["x", "y", "z"];
      mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.666);

      const result = getRandomItem(items);

      expect(result).toBe("y");
    });
  });

  describe("corner cases", () => {
    it("should handle array with null values", () => {
      const items = [null, null, null];
      const result = getRandomItem(items);
      expect(result).toBeNull();
    });

    it("should handle array with undefined values", () => {
      const items = [undefined, undefined];
      const result = getRandomItem(items);
      expect(result).toBeUndefined();
    });

    it("should handle very large arrays", () => {
      const items = Array.from({ length: 10000 }, (_, i) => i);
      const result = getRandomItem(items);
      expect(items).toContain(result);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(10000);
    });

    it("should handle array with duplicate values", () => {
      const items = ["same", "same", "same"];
      const result = getRandomItem(items);
      expect(result).toBe("same");
    });

    it("should handle array with special characters", () => {
      const items = ["!@#$%", "^&*()", "{}[]"];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle array with empty strings", () => {
      const items = ["", "", ""];
      const result = getRandomItem(items);
      expect(result).toBe("");
    });

    it("should handle array with zero", () => {
      const items = [0];
      const result = getRandomItem(items);
      expect(result).toBe(0);
    });

    it("should handle array with negative numbers", () => {
      const items = [-1, -2, -3];
      const result = getRandomItem(items);
      expect(items).toContain(result);
      expect(result).toBeLessThan(0);
    });

    it("should handle array with floating point numbers", () => {
      const items = [1.1, 2.2, 3.3];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle array with Infinity", () => {
      const items = [Infinity, -Infinity, 0];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle array with NaN", () => {
      const items = [NaN, 1, 2];
      const result = getRandomItem(items);
      expect(items.includes(result) || Number.isNaN(result)).toBe(true);
    });
  });
});

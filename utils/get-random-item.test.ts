
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

      // Call the function many times to collect results
      for (let i = 0; i < 100; i++) {
        results.add(getRandomItem(items));
      }

      // With 100 calls on 5 items, we should get at least 2 different items
      // (probability of getting only 1 item is astronomically low)
      expect(results.size).toBeGreaterThan(1);
    });

    it("should potentially return all items given enough calls", () => {
      const items = [1, 2, 3];
      const results = new Set<number>();

      // Call the function many times
      for (let i = 0; i < 1000; i++) {
        results.add(getRandomItem(items));
      }

      // With 1000 calls on 3 items, we should get all items
      // (probability of missing an item is extremely low)
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
    it("should return the first item when Math.random returns 0", () => {
      const items = ["first", "second", "third"];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0);

      const result = getRandomItem(items);

      expect(result).toBe("first");
      mockRandom.mockRestore();
    });

    it("should return the last item when Math.random returns close to 1", () => {
      const items = ["first", "second", "third"];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.999);

      const result = getRandomItem(items);

      expect(result).toBe("third");
      mockRandom.mockRestore();
    });

    it("should return the middle item when Math.random returns 0.5", () => {
      const items = ["first", "second", "third"];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.5);

      const result = getRandomItem(items);

      expect(result).toBe("second");
      mockRandom.mockRestore();
    });

    it("should correctly calculate index with Math.floor", () => {
      const items = [10, 20, 30, 40, 50];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.6);

      const result = getRandomItem(items);

      // 0.6 * 5 = 3, Math.floor(3) = 3, so items[3] = 40
      expect(result).toBe(40);
      mockRandom.mockRestore();
    });

    it("should handle array access with calculated index", () => {
      const items = ["a", "b", "c", "d"];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.25);

      const result = getRandomItem(items);

      // 0.25 * 4 = 1, Math.floor(1) = 1, so items[1] = "b"
      expect(result).toBe("b");
      mockRandom.mockRestore();
    });

    it("should handle fractional index calculation", () => {
      const items = [100, 200, 300];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.33);

      const result = getRandomItem(items);

      // 0.33 * 3 = 0.99, Math.floor(0.99) = 0, so items[0] = 100
      expect(result).toBe(100);
      mockRandom.mockRestore();
    });

    it("should handle two-item array with Math.random = 0.5", () => {
      const items = ["first", "second"];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.5);

      const result = getRandomItem(items);

      // 0.5 * 2 = 1, Math.floor(1) = 1, so items[1] = "second"
      expect(result).toBe("second");
      mockRandom.mockRestore();
    });

    it("should handle large array with specific random value", () => {
      const items = Array.from({ length: 100 }, (_, i) => i);
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.75);

      const result = getRandomItem(items);

      // 0.75 * 100 = 75, Math.floor(75) = 75, so items[75] = 75
      expect(result).toBe(75);
      mockRandom.mockRestore();
    });

    it("should verify Math.random is called exactly once", () => {
      const items = [1, 2, 3];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.5);

      getRandomItem(items);

      expect(mockRandom).toHaveBeenCalledTimes(1);
      mockRandom.mockRestore();
    });

    it("should verify Math.floor is applied to the product", () => {
      const items = ["x", "y", "z"];
      const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.666);

      const result = getRandomItem(items);

      // 0.666 * 3 = 1.998, Math.floor(1.998) = 1, so items[1] = "y"
      expect(result).toBe("y");
      mockRandom.mockRestore();
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
      // NaN !== NaN, so we check if it's in the array differently
      expect(items.includes(result) || Number.isNaN(result)).toBe(true);
    });
  });
});

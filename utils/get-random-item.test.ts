
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
  });
});

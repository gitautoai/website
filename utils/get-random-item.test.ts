/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
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

    it("should work with null values", () => {
      const items = [null, null, null];
      const result = getRandomItem(items);
      expect(result).toBeNull();
    });

    it("should work with undefined values", () => {
      const items = [undefined, undefined];
      const result = getRandomItem(items);
      expect(result).toBeUndefined();
    });

    it("should work with NaN values", () => {
      const items = [NaN, NaN];
      const result = getRandomItem(items);
      expect(result).toBeNaN();
    });

    it("should work with Infinity values", () => {
      const items = [Infinity, -Infinity];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should work with symbol arrays", () => {
      const sym1 = Symbol("test1");
      const sym2 = Symbol("test2");
      const items = [sym1, sym2];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should work with function arrays", () => {
      const fn1 = () => "a";
      const fn2 = () => "b";
      const items = [fn1, fn2];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should work with Date objects", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-12-31");
      const items = [date1, date2];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should work with RegExp objects", () => {
      const regex1 = /test1/;
      const regex2 = /test2/;
      const items = [regex1, regex2];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should work with Map objects", () => {
      const map1 = new Map([["key", "value1"]]);
      const map2 = new Map([["key", "value2"]]);
      const items = [map1, map2];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should work with Set objects", () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([4, 5, 6]);
      const items = [set1, set2];
      const result = getRandomItem(items);
      expect(items).toContain(result);
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

    it("should have roughly uniform distribution", () => {
      const items = ["a", "b", "c", "d"];
      const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };

      // Run many iterations
      for (let i = 0; i < 10000; i++) {
        const result = getRandomItem(items);
        counts[result]++;
      }

      // Each item should appear roughly 25% of the time (2500 times)
      // Allow for statistical variance - check if each is between 20% and 30%
      Object.values(counts).forEach((count) => {
        expect(count).toBeGreaterThan(2000);
        expect(count).toBeLessThan(3000);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty array", () => {
      const items: string[] = [];
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

    it("should handle arrays with duplicate values", () => {
      const items = ["same", "same", "same", "different"];
      const result = getRandomItem(items);
      expect(["same", "different"]).toContain(result);
    });

    it("should handle arrays with empty strings", () => {
      const items = ["", "", "non-empty"];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle arrays with zero", () => {
      const items = [0, 1, 2];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle arrays with negative numbers", () => {
      const items = [-5, -10, -15];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle arrays with very large numbers", () => {
      const items = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle arrays with floating point numbers", () => {
      const items = [0.1, 0.2, 0.3];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle sparse arrays", () => {
      const items = [1, , 3]; // eslint-disable-line no-sparse-arrays
      const result = getRandomItem(items);
      // Result could be 1, undefined (empty slot), or 3
      expect([1, undefined, 3]).toContain(result);
    });
  });

  describe("corner cases", () => {
    it("should handle two-item array", () => {
      const items = ["first", "second"];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should not modify the original array", () => {
      const items = [1, 2, 3];
      const originalLength = items.length;
      const originalItems = [...items];

      getRandomItem(items);

      expect(items.length).toBe(originalLength);
      expect(items).toEqual(originalItems);
    });

    it("should work with frozen arrays", () => {
      const items = Object.freeze(["a", "b", "c"]);
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should work with readonly arrays", () => {
      const items: readonly string[] = ["x", "y", "z"];
      const result = getRandomItem(items as string[]);
      expect(items).toContain(result);
    });

    it("should handle arrays with complex nested objects", () => {
      const items = [
        { user: { profile: { name: "Alice", age: 30 } } },
        { user: { profile: { name: "Bob", age: 25 } } },
      ];
      const result = getRandomItem(items);
      expect(items).toContainEqual(result);
    });

    it("should handle arrays with class instances", () => {
      class TestClass {
        constructor(public value: number) {}
      }
      const items = [new TestClass(1), new TestClass(2)];
      const result = getRandomItem(items);
      expect(items).toContain(result);
      expect(result).toBeInstanceOf(TestClass);
    });

    it("should handle arrays with circular references", () => {
      const obj1: any = { name: "obj1" };
      obj1.self = obj1;
      const obj2: any = { name: "obj2" };
      obj2.self = obj2;
      const items = [obj1, obj2];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });
  });

  describe("Math.random edge cases", () => {
    let originalRandom: () => number;

    beforeEach(() => {
      originalRandom = Math.random;
    });

    afterEach(() => {
      Math.random = originalRandom;
    });

    it("should return first item when Math.random returns 0", () => {
      Math.random = () => 0;
      const items = ["first", "second", "third"];
      expect(getRandomItem(items)).toBe("first");
    });

    it("should return last item when Math.random returns close to 1", () => {
      Math.random = () => 0.9999999;
      const items = ["first", "second", "third"];
      expect(getRandomItem(items)).toBe("third");
    });

    it("should return middle item when Math.random returns 0.5", () => {
      Math.random = () => 0.5;
      const items = ["first", "second", "third"];
      expect(getRandomItem(items)).toBe("second");
    });

    it("should handle Math.random returning exactly 0.33 for 3-item array", () => {
      Math.random = () => 0.33;
      const items = ["a", "b", "c"];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it("should handle Math.random returning exactly 0.66 for 3-item array", () => {
      Math.random = () => 0.66;
      const items = ["a", "b", "c"];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });
  });

  describe("type safety", () => {
    it("should maintain type information for string arrays", () => {
      const items = ["a", "b", "c"];
      const result: string = getRandomItem(items);
      expect(typeof result).toBe("string");
    });

    it("should maintain type information for number arrays", () => {
      const items = [1, 2, 3];
      const result: number = getRandomItem(items);
      expect(typeof result).toBe("number");
    });

    it("should maintain type information for custom type arrays", () => {
      interface CustomType {
        id: number;
        name: string;
      }
      const items: CustomType[] = [
        { id: 1, name: "first" },
        { id: 2, name: "second" },
      ];
      const result: CustomType = getRandomItem(items);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
    });
  });
});

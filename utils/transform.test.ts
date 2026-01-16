import { stringify } from "./transform";

describe("stringify", () => {
  describe("primitive types", () => {
    it("should stringify strings", () => {
      expect(stringify("hello")).toBe(JSON.stringify("hello"));
      expect(stringify("")).toBe(JSON.stringify(""));
      expect(stringify("with spaces")).toBe(JSON.stringify("with spaces"));
    });

    it("should stringify numbers", () => {
      expect(stringify(42)).toBe(JSON.stringify(42));
      expect(stringify(0)).toBe(JSON.stringify(0));
      expect(stringify(-1)).toBe(JSON.stringify(-1));
      expect(stringify(3.14)).toBe(JSON.stringify(3.14));
      expect(stringify(Infinity)).toBe(JSON.stringify(Infinity));
      expect(stringify(-Infinity)).toBe(JSON.stringify(-Infinity));
      expect(stringify(NaN)).toBe(JSON.stringify(NaN));
    });

    it("should stringify booleans", () => {
      expect(stringify(true)).toBe(JSON.stringify(true));
      expect(stringify(false)).toBe(JSON.stringify(false));
    });

    it("should stringify null and undefined", () => {
      expect(stringify(null)).toBe(JSON.stringify(null));
      expect(stringify(undefined)).toBe(JSON.stringify(undefined));
    });
  });

  describe("bigint handling", () => {
    it("should stringify bigint with n suffix", () => {
      expect(stringify(BigInt(123))).toBe('"123n"');
      expect(stringify(BigInt(0))).toBe('"0n"');
      expect(stringify(BigInt(-456))).toBe('"-456n"');
    });

    it("should stringify large bigint values", () => {
      const largeBigInt = BigInt("9007199254740991");
      expect(stringify(largeBigInt)).toBe('"9007199254740991n"');

      const veryLargeBigInt = BigInt("123456789012345678901234567890");
      expect(stringify(veryLargeBigInt)).toBe(
        '"123456789012345678901234567890n"'
      );
    });

    it("should stringify objects containing bigint", () => {
      const obj = { id: BigInt(123), name: "test" };
      expect(stringify(obj)).toBe('{"id":"123n","name":"test"}');
    });

    it("should stringify arrays containing bigint", () => {
      const arr = [BigInt(1), BigInt(2), BigInt(3)];
      expect(stringify(arr)).toBe('["1n","2n","3n"]');
    });

    it("should stringify nested structures with bigint", () => {
      const nested = {
        user: {
          id: BigInt(999),
          balance: BigInt(1000000),
        },
        items: [BigInt(1), BigInt(2)],
      };
      expect(stringify(nested)).toBe(
        '{"user":{"id":"999n","balance":"1000000n"},"items":["1n","2n"]}'
      );
    });

    it("should stringify mixed types with bigint", () => {
      const mixed = {
        bigIntValue: BigInt(42),
        numberValue: 42,
        stringValue: "42",
        boolValue: true,
        nullValue: null,
      };
      expect(stringify(mixed)).toBe(
        '{"bigIntValue":"42n","numberValue":42,"stringValue":"42","boolValue":true,"nullValue":null}'
      );
    });
  });

  describe("objects", () => {
    it("should stringify empty objects", () => {
      expect(stringify({})).toBe(JSON.stringify({}));
    });

    it("should stringify simple objects", () => {
      const obj = { name: "John", age: 30 };
      expect(stringify(obj)).toBe(JSON.stringify(obj));
    });

    it("should stringify nested objects", () => {
      const nested = {
        user: {
          name: "Alice",
          address: {
            city: "NYC",
            zip: "10001",
          },
        },
      };
      expect(stringify(nested)).toBe(JSON.stringify(nested));
    });

    it("should stringify objects with various value types", () => {
      const obj = {
        str: "text",
        num: 123,
        bool: true,
        nil: null,
        arr: [1, 2, 3],
        obj: { nested: "value" },
      };
      expect(stringify(obj)).toBe(JSON.stringify(obj));
    });
  });

  describe("arrays", () => {
    it("should stringify empty arrays", () => {
      expect(stringify([])).toBe(JSON.stringify([]));
    });

    it("should stringify arrays of primitives", () => {
      expect(stringify([1, 2, 3])).toBe(JSON.stringify([1, 2, 3]));
      expect(stringify(["a", "b", "c"])).toBe(JSON.stringify(["a", "b", "c"]));
      expect(stringify([true, false])).toBe(JSON.stringify([true, false]));
    });

    it("should stringify arrays of objects", () => {
      const arr = [
        { id: 1, name: "first" },
        { id: 2, name: "second" },
      ];
      expect(stringify(arr)).toBe(JSON.stringify(arr));
    });

    it("should stringify nested arrays", () => {
      const nested = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      expect(stringify(nested)).toBe(JSON.stringify(nested));
    });

    it("should stringify mixed type arrays", () => {
      const mixed = [1, "two", true, null, { key: "value" }];
      expect(stringify(mixed)).toBe(JSON.stringify(mixed));
    });
  });

  describe("edge cases", () => {
    it("should handle objects with special characters in keys", () => {
      const obj = { "key with spaces": "value", "key-with-dashes": "value2" };
      expect(stringify(obj)).toBe(JSON.stringify(obj));
    });

    it("should handle empty strings in objects", () => {
      const obj = { key: "" };
      expect(stringify(obj)).toBe(JSON.stringify(obj));
    });

    it("should handle Date objects", () => {
      const date = new Date("2026-01-16T00:00:00.000Z");
      expect(stringify(date)).toBe(JSON.stringify(date));
    });

    it("should handle arrays with bigint and other types", () => {
      const arr = [BigInt(1), "string", 42, true, null, { key: "value" }];
      expect(stringify(arr)).toBe(
        '["1n","string",42,true,null,{"key":"value"}]'
      );
    });

    it("should handle deeply nested structures with bigint", () => {
      const deep = {
        level1: {
          level2: {
            level3: {
              id: BigInt(123),
              data: [BigInt(1), BigInt(2)],
            },
          },
        },
      };
      expect(stringify(deep)).toBe(
        '{"level1":{"level2":{"level3":{"id":"123n","data":["1n","2n"]}}}}'
      );
    });

    it("should handle objects with numeric keys", () => {
      const obj = { 0: "zero", 1: "one", 2: "two" };
      expect(stringify(obj)).toBe(JSON.stringify(obj));
    });

    it("should handle arrays with undefined and null", () => {
      const arr = [1, undefined, null, 4];
      expect(stringify(arr)).toBe(JSON.stringify(arr));
    });

    it("should handle objects with undefined values", () => {
      const obj = { a: 1, b: undefined, c: 3 };
      expect(stringify(obj)).toBe(JSON.stringify(obj));
    });

    it("should handle negative bigint values", () => {
      const obj = {
        positive: BigInt(100),
        negative: BigInt(-100),
        zero: BigInt(0),
      };
      expect(stringify(obj)).toBe(
        '{"positive":"100n","negative":"-100n","zero":"0n"}'
      );
    });
  });

  describe("corner cases", () => {
    it("should handle empty nested structures", () => {
      const obj = { empty: {}, emptyArr: [], nested: { inner: {} } };
      expect(stringify(obj)).toBe(JSON.stringify(obj));
    });

    it("should handle special number values in objects", () => {
      const obj = {
        infinity: Infinity,
        negInfinity: -Infinity,
        nan: NaN,
        regular: 42,
      };
      expect(stringify(obj)).toBe(JSON.stringify(obj));
    });

    it("should handle bigint in complex nested array", () => {
      const arr = [
        [BigInt(1), BigInt(2)],
        [BigInt(3), BigInt(4)],
      ];
      expect(stringify(arr)).toBe('[["1n","2n"],["3n","4n"]]');
    });

    it("should handle object with only bigint values", () => {
      const obj = {
        a: BigInt(1),
        b: BigInt(2),
        c: BigInt(3),
      };
      expect(stringify(obj)).toBe('{"a":"1n","b":"2n","c":"3n"}');
    });

    it("should handle array with only bigint values", () => {
      const arr = [BigInt(10), BigInt(20), BigInt(30)];
      expect(stringify(arr)).toBe('["10n","20n","30n"]');
    });

    it("should handle mixed nested structures", () => {
      const complex = {
        users: [
          { id: BigInt(1), name: "Alice", active: true },
          { id: BigInt(2), name: "Bob", active: false },
        ],
        metadata: {
          count: 2,
          total: BigInt(1000),
        },
      };
      expect(stringify(complex)).toBe(
        '{"users":[{"id":"1n","name":"Alice","active":true},{"id":"2n","name":"Bob","active":false}],"metadata":{"count":2,"total":"1000n"}}'
      );
    });
  });
});

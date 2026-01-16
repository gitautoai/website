import { stringify } from "./transform";

describe("stringify", () => {
  describe("primitive types", () => {
    it("should stringify strings", () => {
      expect(stringify("hello")).toBe('"hello"');
      expect(stringify("")).toBe('""');
      expect(stringify("with spaces")).toBe('"with spaces"');
    });

    it("should stringify numbers", () => {
      expect(stringify(42)).toBe("42");
      expect(stringify(0)).toBe("0");
      expect(stringify(-1)).toBe("-1");
      expect(stringify(3.14)).toBe("3.14");
    });

    it("should stringify booleans", () => {
      expect(stringify(true)).toBe("true");
      expect(stringify(false)).toBe("false");
    });

    it("should stringify null", () => {
      expect(stringify(null)).toBe("null");
    });

    it("should stringify undefined", () => {
      expect(stringify(undefined)).toBe(undefined);
    });
  });

  describe("bigint handling", () => {
    it("should convert bigint to string with 'n' suffix", () => {
      expect(stringify(BigInt(123))).toBe('"123n"');
      expect(stringify(BigInt(0))).toBe('"0n"');
      expect(stringify(BigInt(-456))).toBe('"-456n"');
    });

    it("should handle large bigint values", () => {
      const largeBigInt = BigInt("9007199254740991");
      expect(stringify(largeBigInt)).toBe('"9007199254740991n"');
    });

    it("should handle bigint in objects", () => {
      const obj = { id: BigInt(123), name: "test" };
      expect(stringify(obj)).toBe('{"id":"123n","name":"test"}');
    });

    it("should handle bigint in arrays", () => {
      const arr = [BigInt(1), BigInt(2), BigInt(3)];
      expect(stringify(arr)).toBe('["1n","2n","3n"]');
    });

    it("should handle multiple bigints in nested structures", () => {
      const obj = {
        user: {
          id: BigInt(123),
          balance: BigInt(1000),
        },
        items: [BigInt(1), BigInt(2)],
      };
      expect(stringify(obj)).toBe(
        '{"user":{"id":"123n","balance":"1000n"},"items":["1n","2n"]}'
      );
    });
  });

  describe("objects", () => {
    it("should stringify simple objects", () => {
      expect(stringify({ a: 1, b: 2 })).toBe('{"a":1,"b":2}');
    });

    it("should stringify empty objects", () => {
      expect(stringify({})).toBe("{}");
    });

    it("should stringify nested objects", () => {
      const obj = { a: { b: { c: 1 } } };
      expect(stringify(obj)).toBe('{"a":{"b":{"c":1}}}');
    });

    it("should stringify objects with mixed types", () => {
      const obj = {
        string: "value",
        number: 42,
        boolean: true,
        null: null,
        bigint: BigInt(999),
      };
      expect(stringify(obj)).toBe(
        '{"string":"value","number":42,"boolean":true,"null":null,"bigint":"999n"}'
      );
    });
  });

  describe("arrays", () => {
    it("should stringify simple arrays", () => {
      expect(stringify([1, 2, 3])).toBe("[1,2,3]");
    });

    it("should stringify empty arrays", () => {
      expect(stringify([])).toBe("[]");
    });

    it("should stringify nested arrays", () => {
      expect(stringify([[1, 2], [3, 4]])).toBe("[[1,2],[3,4]]");
    });

    it("should stringify arrays with mixed types", () => {
      const arr = ["string", 42, true, null, BigInt(123)];
      expect(stringify(arr)).toBe('["string",42,true,null,"123n"]');
    });
  });

  describe("complex structures", () => {
    it("should handle deeply nested structures", () => {
      const complex = {
        level1: {
          level2: {
            level3: [BigInt(1), { value: BigInt(2) }],
          },
        },
      };
      expect(stringify(complex)).toBe(
        '{"level1":{"level2":{"level3":["1n",{"value":"2n"}]}}}'
      );
    });
  });
});

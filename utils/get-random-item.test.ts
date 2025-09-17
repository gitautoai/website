import { getRandomItem } from './get-random-item';

describe('getRandomItem', () => {
  // Mock Math.random to control randomness in tests
  let mockMathRandom: jest.SpyInstance;

  beforeEach(() => {
    mockMathRandom = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    mockMathRandom.mockRestore();
  });

  describe('happy path scenarios', () => {
    it('should return the first item when Math.random returns 0', () => {
      mockMathRandom.mockReturnValue(0);
      const items = ['apple', 'banana', 'cherry'];

      const result = getRandomItem(items);

      expect(result).toBe('apple');
    });

    it('should return the last item when Math.random returns close to 1', () => {
      mockMathRandom.mockReturnValue(0.999);
      const items = ['apple', 'banana', 'cherry'];

      const result = getRandomItem(items);

      expect(result).toBe('cherry');
    });

    it('should return the middle item when Math.random returns 0.5', () => {
      mockMathRandom.mockReturnValue(0.5);
      const items = ['apple', 'banana', 'cherry'];

      const result = getRandomItem(items);

      expect(result).toBe('banana');
    });

    it('should work with single item array', () => {
      mockMathRandom.mockReturnValue(0.5);
      const items = ['only-item'];

      const result = getRandomItem(items);

      expect(result).toBe('only-item');
    });

    it('should work with different data types - numbers', () => {
      mockMathRandom.mockReturnValue(0);
      const items = [1, 2, 3, 4, 5];

      const result = getRandomItem(items);

      expect(result).toBe(1);
    });

    it('should work with different data types - objects', () => {
      mockMathRandom.mockReturnValue(0);
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const result = getRandomItem(items);

      expect(result).toEqual({ id: 1 });
    });

    it('should work with different data types - mixed types', () => {
      mockMathRandom.mockReturnValue(0);
      const items = ['string', 42, { key: 'value' }, null, undefined];

      const result = getRandomItem(items);

      expect(result).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('should handle empty array gracefully', () => {
      mockMathRandom.mockReturnValue(0);
      const items: string[] = [];

      const result = getRandomItem(items);

      expect(result).toBeUndefined(); // Runtime behavior: items[0] on empty array returns undefined
    });

    it('should handle very large arrays', () => {
      mockMathRandom.mockReturnValue(0.5);
      const items = Array.from({ length: 10000 }, (_, i) => i);

      const result = getRandomItem(items);

      expect(result).toBe(5000);
    });

    it('should handle arrays with undefined values', () => {
      mockMathRandom.mockReturnValue(0);
      const items = [undefined, 'defined', null];

      const result = getRandomItem(items);

      expect(result).toBeUndefined();
    });

    it('should handle arrays with null values', () => {
      mockMathRandom.mockReturnValue(1 / 3);
      const items = ['defined', null, 'another'];

      const result = getRandomItem(items);

      expect(result).toBeNull();
    });

    it('should not mutate the input array', () => {
      mockMathRandom.mockReturnValue(0.5);
      const items = ['a', 'b', 'c'];
      const originalItems = [...items];

      getRandomItem(items);

      expect(items).toEqual(originalItems);
    });
  });

  describe('boundary conditions', () => {
    it('should handle Math.random returning exactly 0', () => {
      mockMathRandom.mockReturnValue(0);
      const items = ['first', 'second', 'third'];

      const result = getRandomItem(items);

      expect(result).toBe('first');
    });

    it('should handle Math.random returning value very close to 1', () => {
      mockMathRandom.mockReturnValue(0.9999999);
      const items = ['first', 'second', 'third'];

      const result = getRandomItem(items);

      expect(result).toBe('third');
    });

    it('should handle fractional indices correctly', () => {
      mockMathRandom.mockReturnValue(0.33);
      const items = ['a', 'b', 'c'];

      const result = getRandomItem(items);

      expect(result).toBe('a'); // Math.floor(0.33 * 3) = Math.floor(0.99) = 0
    });

    it('should handle fractional indices at boundary', () => {
      mockMathRandom.mockReturnValue(0.34);
      const items = ['a', 'b', 'c'];

      const result = getRandomItem(items);

      expect(result).toBe('b'); // Math.floor(0.34 * 3) = Math.floor(1.02) = 1
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with generic types - numbers', () => {
      mockMathRandom.mockReturnValue(0);
      const items: number[] = [1, 2, 3];

      const result: number = getRandomItem(items);

      expect(typeof result).toBe('number');
      expect(result).toBe(1);
    });

    it('should maintain type safety with generic types - strings', () => {
      mockMathRandom.mockReturnValue(0);
      const items: string[] = ['a', 'b', 'c'];

      const result: string = getRandomItem(items);

      expect(typeof result).toBe('string');
      expect(result).toBe('a');
    });

    it('should maintain type safety with generic types - custom objects', () => {
      interface TestObject {
        id: number;
        name: string;
      }

      mockMathRandom.mockReturnValue(0);
      const items: TestObject[] = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' }
      ];

      const result: TestObject = getRandomItem(items);

      expect(result).toEqual({ id: 1, name: 'first' });
      expect(result.id).toBe(1);
      expect(result.name).toBe('first');
    });
  });

  describe('mathematical correctness', () => {
    it('should use Math.floor correctly for index calculation', () => {
      const mathFloorSpy = jest.spyOn(Math, 'floor');
      mockMathRandom.mockReturnValue(0.7);
      const items = ['a', 'b', 'c', 'd', 'e'];

      getRandomItem(items);

      expect(mathFloorSpy).toHaveBeenCalledWith(0.7 * 5);
      expect(mathFloorSpy).toHaveBeenCalledWith(3.5);

      mathFloorSpy.mockRestore();
    });

    it('should multiply Math.random by array length correctly', () => {
      mockMathRandom.mockReturnValue(0.6);
      const items = ['a', 'b', 'c', 'd', 'e']; // length = 5

      const result = getRandomItem(items);

      // 0.6 * 5 = 3.0, Math.floor(3.0) = 3, items[3] = 'd'
      expect(result).toBe('d');
    });
  });
});

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

      expect(result).toBeUndefined();
    });
  });
});

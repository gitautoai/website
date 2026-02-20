export const functionStyleTest = `describe('calculateDiscount', () => {
  it('should return 0 when amount is 0', () => {
    expect(calculateDiscount(0, 0.1)).toBe(0);
  });

  it('should calculate 10% discount correctly', () => {
    expect(calculateDiscount(100, 0.1)).toBe(10);
  });
});`;

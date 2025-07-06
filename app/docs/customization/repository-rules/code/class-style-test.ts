export const classStyleTest = `class CalculatorTest {
  testCalculateDiscountWithZeroAmount() {
    expect(calculateDiscount(0, 0.1)).toBe(0);
  }

  testCalculateDiscountWithValidInput() {
    expect(calculateDiscount(100, 0.1)).toBe(10);
  }
}`;

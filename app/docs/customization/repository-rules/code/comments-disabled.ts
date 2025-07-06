export const commentsDisabled = `function calculateTax(amount: number, rate: number): number {
  if (amount <= 0) return 0;
  if (rate < 0 || rate > 1) return 0;
  return amount * rate;
}`;

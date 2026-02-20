export const commentsEnabled = `/**
 * Calculates tax amount based on base amount and tax rate
 * @param amount - Base amount to calculate tax for
 * @param rate - Tax rate (0-1)
 * @returns Calculated tax amount
 */
function calculateTax(amount: number, rate: number): number {
  // Validate amount is positive
  if (amount <= 0) return 0;
  // Validate rate is between 0 and 1
  if (rate < 0 || rate > 1) return 0;
  // Calculate and return tax
  return amount * rate;
}`;

import { CREDIT_PRICING } from '@/config/pricing';

export function validateCreditAmount(amount: number): { isValid: boolean; error?: string } {
  if (!Number.isInteger(amount)) {
    return {
      isValid: false,
      error: 'Credit amount must be a whole number'
    };
  }

  if (amount < CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD) {
    return {
      isValid: false,
      error: `Credit amount must be at least $${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD}`
    };
  }

  if (amount > CREDIT_PRICING.PURCHASE_LIMITS.MAX_AMOUNT_USD) {
    return {
      isValid: false,
      error: `Credit amount cannot exceed $${CREDIT_PRICING.PURCHASE_LIMITS.MAX_AMOUNT_USD}`
    };
  }

  return { isValid: true };
}
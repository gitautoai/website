/**
 * Format percentage value with floor rounding
 */
export function formatPercentage(value: number | null): string {
  if (value === null || isNaN(value)) return "0%";
  return `${Math.floor(value)}%`;
}

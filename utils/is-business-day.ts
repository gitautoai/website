/**
 * Check if a given date (UTC) is a business day: not a weekend, not a major US holiday.
 *
 * Holidays covered (US):
 * - New Year's Day (Jan 1)
 * - Memorial Day (last Monday in May)
 * - Independence Day (Jul 4)
 * - Labor Day (first Monday in September)
 * - Thanksgiving (fourth Thursday in November)
 * - Christmas Day (Dec 25)
 */
export const isBusinessDay = (date: Date = new Date()): boolean => {
  const day = date.getUTCDay();
  if (day === 0 || day === 6) return false;

  const month = date.getUTCMonth(); // 0-indexed
  const dayOfMonth = date.getUTCDate();
  const year = date.getUTCFullYear();

  // Fixed-date holidays
  if (month === 0 && dayOfMonth === 1) return false; // New Year's Day
  if (month === 6 && dayOfMonth === 4) return false; // Independence Day
  if (month === 11 && dayOfMonth === 25) return false; // Christmas Day

  // Memorial Day: last Monday in May
  if (month === 4 && day === 1) {
    const lastDayOfMay = new Date(Date.UTC(year, 5, 0)).getUTCDate();
    if (dayOfMonth > lastDayOfMay - 7) return false;
  }

  // Labor Day: first Monday in September
  if (month === 8 && day === 1 && dayOfMonth <= 7) return false;

  // Thanksgiving: fourth Thursday in November
  if (month === 10 && day === 4) {
    const thursdayCount = Math.ceil(dayOfMonth / 7);
    if (thursdayCount === 4) return false;
  }

  return true;
};

/**
 * Formats an ISO timestamp as a human-readable relative time phrase.
 *
 * Examples:
 *   - Same month/year: "a few weeks ago"
 *   - Different month, same year: "back in Jan"
 *   - Different year: "back in Jan 2025"
 */
export const formatRelativeTime = (isoTimestamp: string) => {
  const date = new Date(isoTimestamp);
  const now = new Date();
  if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear())
    return "a few weeks ago";
  const month = date.toLocaleDateString("en-US", { month: "short" });
  if (date.getFullYear() === now.getFullYear()) return `back in ${month}`;
  return `back in ${month} ${date.getFullYear()}`;
};

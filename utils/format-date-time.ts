/**
 * Format date string to readable format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      weekday: "short", // "Sun"
      month: "short", // "Mar"
      day: "numeric", // "23"
      hour: "numeric", // "4"
      minute: "2-digit", // "13"
      hour12: true, // PM/AM
    })
    .replace(",", "")
    .replace(/\s+/g, " ");
}

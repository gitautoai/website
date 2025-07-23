/**
 * Format date string to readable format
 */
export function formatDateTime(dateString: string, options: { includeTime?: boolean } = { includeTime: true }): string {
  const date = new Date(dateString);
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // "Sun"
    month: "short", // "Mar"
    day: "numeric", // "23"
  };
  
  if (options.includeTime) {
    formatOptions.hour = "numeric"; // "4"
    formatOptions.minute = "2-digit"; // "13"
    formatOptions.hour12 = true; // PM/AM
  } else {
    formatOptions.year = "numeric"; // "2024"
  }
  
  return date
    .toLocaleDateString("en-US", formatOptions)
    .replace(",", "")
    .replace(/\s+/g, " ");
}

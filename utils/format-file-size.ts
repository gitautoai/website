/**
 * Format file size with 2 significant digits
 */
export function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes === 0) return "N/A";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  // Round to 2 significant digits
  const factor = Math.pow(10, 1 - Math.floor(Math.log10(value)));
  const rounded = Math.round(value * factor) / factor;

  // Format based on the rounded value
  let formatted: string;
  if (rounded >= 10) {
    // 10 or above: no decimal places (e.g., 28KB, 900KB)
    formatted = Math.round(rounded).toString();
  } else {
    // Below 10: one decimal place (e.g., 1.0KB, 9.9KB)
    formatted = rounded.toFixed(1);
  }

  return `${formatted} ${sizes[i]}`;
}

/**
 * Get CSS class for coverage level styling
 */
export function getLevelStyle(level: string): string {
  switch (level) {
    case "repository":
      return "bg-blue-50";
    case "directory":
      return "bg-green-50";
    case "file":
      return "";
    default:
      return "";
  }
}

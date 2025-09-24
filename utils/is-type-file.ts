/**
 * Check if a file is a type definition file (same logic as gitauto schedule handler)
 */
export function isTypeFile(filename: string): boolean {
  if (!filename || typeof filename !== "string") return false;

  const filenameLower = filename.toLowerCase();

  const typePatterns = [
    /\/types?\//,
    /^types?\//,
    /\.types?\./,
    /\.d\.ts$/,
    /types?\./,
    /_types?\./,
    /^types?_/,
    /\/schemas?\//,
    /^schemas?\//,
    /\.schema\./,
    /schemas?\./,
    /\/interfaces?\//,
    /^interfaces?\//,
    /\.interface\./,
    /interfaces?\./,
    /\/models?\/.*\.py$/,
    /^models?\/.*\.py$/,
    /\/constants?\//,
    /^constants?\//,
    /\.constants?\./,
    /constants?\./,
    /_constants?\./,
    /\/enums?\//,
    /^enums?\//,
    /\.enums?\./,
    /enums?\./,
  ];

  // Check if any pattern matches
  const matches = typePatterns.some((pattern) => pattern.test(filenameLower));

  if (!matches) return false;

  // Additional filtering to prevent false positives
  // Patterns that should NOT be considered type files even if they match broad patterns
  const excludePatterns = [
    /get_.*_type/, // get_billing_type.py - business logic, not type definition
    /.*_type_.*\./, // files with type in the middle like some_type_handler.py
  ];

  // If any exclude pattern matches, it's not a type file
  if (excludePatterns.some((pattern) => pattern.test(filenameLower))) {
    return false;
  }

  return true;
}

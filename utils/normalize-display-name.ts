/**
 * Normalize a GitHub display name for storage and email greetings.
 * 1. NFKC normalization: converts Unicode bold/italic/fancy chars to plain ASCII
 * 2. Title-case: capitalizes first letter of each word, lowercases the rest
 */
export const normalizeDisplayName = (raw: string) =>
  raw
    .normalize("NFKC")
    .replace(/\./g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\B\w/g, (c) => c.toLowerCase());

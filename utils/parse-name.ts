// Cross-ref: gitauto/services/resend/get_first_name.py
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const parseName = (fullName: string) => {
  const nameParts = fullName
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .trim()
    .split(/\s+/);

  // Skip title prefixes like "Dr." or initials like "L." when followed by an actual name
  const idx = nameParts[0]?.endsWith(".") && nameParts.length > 1 ? 1 : 0;
  let raw = nameParts[idx];

  // Handle dot-separated tokens (e.g. "Frater.nul" → "Frater", "M.Rama" → "Rama")
  const dotParts = raw?.split(".");
  if (dotParts && dotParts.length > 1 && dotParts[1])
    raw = dotParts.reduce((a, b) => (b.length > a.length ? b : a));

  // Single-token hyphenated names are firstname-lastname (e.g. "cuong-tran" → "cuong")
  // Multi-token keeps hyphens (e.g. "Mary-Jane Watson" → "Mary-Jane")
  if (nameParts.length === 1 && raw?.includes("-")) raw = raw.split("-")[0];

  // Names containing digits are likely GitHub usernames (e.g. "St119848"), not real names
  const firstName = raw && !/\d/.test(raw) ? capitalize(raw) : "there";

  return {
    firstName,
    lastName: nameParts[nameParts.length - 1] || "",
  };
};

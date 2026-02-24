/** Format line counts for display: 800 → "800", 5000 → "5K", 29860 → "30K" */
export const formatLines = (lines: number) =>
  lines >= 1000 ? `${Math.round(lines / 1000)}K` : `${lines}`;

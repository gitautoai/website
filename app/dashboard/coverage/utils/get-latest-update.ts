import { Tables } from "@/types/supabase";
import { formatDateTime } from "@/utils/format-date-time";

/**
 * Get the latest update timestamp from coverage data
 */
export function getLatestUpdate(coverageData: Tables<"coverages">[]) {
  if (coverageData.length === 0) return null;

  const latestDate = coverageData.reduce((latest, item) => {
    const itemDate = new Date(item.updated_at);
    return latest > itemDate ? latest : itemDate;
  }, new Date(0));

  return formatDateTime(latestDate.toISOString());
}

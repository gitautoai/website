import { CoverageData } from "@/app/dashboard/coverage/types";

/**
 * Count items by level from filtered data
 */
export function getLevelCounts(filteredData: CoverageData[]) {
  const counts = { repository: 0, directory: 0, file: 0 };
  filteredData.forEach((item) => {
    if (item.level in counts) counts[item.level as keyof typeof counts]++;
  });
  return counts;
}

import { CoverageData } from "../types";
import { getLevelCounts } from "../utils/get-level-counts";
import { getLatestUpdate } from "../utils/get-latest-update";

interface CoverageStatsProps {
  filteredData: CoverageData[];
  coverageData: CoverageData[];
}

export default function CoverageStats({ filteredData, coverageData }: CoverageStatsProps) {
  return (
    <div className="mb-4 md:mb-2">
      <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:items-center text-sm text-gray-600">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {Object.entries(getLevelCounts(filteredData)).map(([level, count]) => (
            <span key={level} className="capitalize">
              {level}: {count}
            </span>
          ))}
          {getLatestUpdate(coverageData) && (
            <>
              <span>Branch: {coverageData[0]?.branch_name}</span>
              <span>Last updated: {getLatestUpdate(coverageData)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

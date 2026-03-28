import { Tables } from "@/types/supabase";
import { formatPercentage } from "@/utils/format-percentage";

interface CoverageStatsProps {
  data: Tables<"repo_coverage">[];
}

export default function CoverageStats({ data }: CoverageStatsProps) {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : null;

  const calculateChange = (current: number, prev: number | null) => {
    if (prev === null) return null;
    return current - prev;
  };

  const statementChange = calculateChange(
    latest.statement_coverage ?? 0,
    previous?.statement_coverage ?? null,
  );
  const hasFunctionCoverage = data.some((item) => item.functions_total > 0);
  const functionChange = hasFunctionCoverage
    ? calculateChange(latest.function_coverage ?? 0, previous?.function_coverage ?? null)
    : null;
  const hasBranchCoverage = data.some((item) => item.branches_total > 0);
  const branchChange = hasBranchCoverage
    ? calculateChange(latest.branch_coverage ?? 0, previous?.branch_coverage ?? null)
    : null;

  const formatChange = (change: number | null) => {
    if (change === null) return "";
    const sign = change >= 0 ? "+" : "";
    const color = change >= 0 ? "text-green-600" : "text-red-600";
    return (
      <span className={`hidden md:inline text-sm ml-2 ${color}`}>
        ({sign}
        {formatPercentage(change)} vs last)
      </span>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      <div className="bg-white p-2 md:p-4 rounded-lg border">
        <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
          <span className="md:hidden">Statement Cov.</span>
          <span className="hidden md:inline">Statement Coverage</span>
        </h4>
        <div className="flex items-center">
          <span className="text-lg md:text-2xl font-bold">
            {formatPercentage(latest.statement_coverage ?? 0)}
          </span>
          {formatChange(statementChange)}
        </div>
      </div>

      <div className="bg-white p-2 md:p-4 rounded-lg border">
        <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
          <span className="md:hidden">Function Cov.</span>
          <span className="hidden md:inline">Function Coverage</span>
        </h4>
        {hasFunctionCoverage ? (
          <div className="flex items-center">
            <span className="text-lg md:text-2xl font-bold">
              {formatPercentage(latest.function_coverage ?? 0)}
            </span>
            {formatChange(functionChange)}
          </div>
        ) : (
          <span className="text-xs text-gray-400">Not measured by coverage tool</span>
        )}
      </div>

      <div className="bg-white p-2 md:p-4 rounded-lg border">
        <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
          <span className="md:hidden">Branch Cov.</span>
          <span className="hidden md:inline">Branch Coverage</span>
        </h4>
        {hasBranchCoverage ? (
          <div className="flex items-center">
            <span className="text-lg md:text-2xl font-bold">
              {formatPercentage(latest.branch_coverage ?? 0)}
            </span>
            {formatChange(branchChange)}
          </div>
        ) : (
          <span className="text-xs text-gray-400">Not measured by coverage tool</span>
        )}
      </div>
    </div>
  );
}

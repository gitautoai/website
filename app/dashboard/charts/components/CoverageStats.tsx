import { Tables } from "@/types/supabase";
import { formatPercentage } from "@/utils/format-percentage";

interface CoverageStatsProps {
  data: Tables<"repo_coverage">[];
  isDummyData?: boolean;
}

export default function CoverageStats({ data, isDummyData = false }: CoverageStatsProps) {
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
      <span className={`text-sm ml-2 ${color}`}>
        ({sign}
        {formatPercentage(change)} vs last)
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {isDummyData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-700">
            ⚡ Latest demo metrics - Your actual coverage data will appear here once available
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Statement Coverage</h4>
          <div className="flex items-center">
            <span className="text-2xl font-bold">
              {formatPercentage(latest.statement_coverage ?? 0)}
            </span>
            {formatChange(statementChange)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Function Coverage</h4>
          <div className="flex items-center">
            {hasFunctionCoverage ? (
              <>
                <span className="text-2xl font-bold">
                  {formatPercentage(latest.function_coverage ?? 0)}
                </span>
                {formatChange(functionChange)}
              </>
            ) : (
              <span className="text-sm text-gray-400">Not measured by coverage tool</span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Branch Coverage</h4>
          <div className="flex items-center">
            {hasBranchCoverage ? (
              <>
                <span className="text-2xl font-bold">
                  {formatPercentage(latest.branch_coverage ?? 0)}
                </span>
                {formatChange(branchChange)}
              </>
            ) : (
              <span className="text-sm text-gray-400">Not measured by coverage tool</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

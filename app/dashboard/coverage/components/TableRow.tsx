// Local imports (Absolute imports)
import ExternalLinkIcon from "@/app/components/icons/ExternalLinkIcon";
import { Tables } from "@/types/supabase";
import { formatFileSize } from "@/utils/format-file-size";
import { formatPercentage } from "@/utils/format-percentage";

// Local imports (Relative imports)
import { Metric } from "../types";
import { getLevelStyle } from "../utils/get-level-style";
import { getMetricValue } from "../utils/get-metric-value";

interface TableRowProps {
  item: Tables<"coverages">;
  selectedRows: number[];
  onSelectRow: (id: number) => void;
  selectedMobileMetric: Metric;
}

export default function TableRow({
  item,
  selectedRows,
  onSelectRow,
  selectedMobileMetric,
}: TableRowProps) {
  const isExcluded = item.is_excluded_from_testing;
  const isSelected = selectedRows.includes(item.id);

  return (
    <tr
      className={`
        border-b transition-all duration-200
        ${isExcluded ? "bg-gray-50 opacity-60 hover:bg-gray-100" : "hover:bg-pink-50"}
        ${getLevelStyle(item.level)}
        ${isSelected ? "bg-pink-50" : ""}
      `}
    >
      <td
        className={`py-2 px-2 border-r text-center align-middle ${
          item.level === "file" ? "cursor-pointer" : ""
        }`}
        onClick={() => item.level === "file" && onSelectRow(item.id)}
      >
        {item.level === "file" && (
          <input type="checkbox" checked={isSelected} readOnly className="rounded" />
        )}
      </td>
      <td
        className="py-2 px-2 border-r break-words whitespace-normal md:truncate"
        title={item.full_path}
      >
        <div className={isExcluded ? "line-through text-gray-500" : ""}>
          {item.github_issue_url ? (
            <div className="flex items-center gap-2 text-pink-600 hover:text-pink-700 visited:text-pink-700">
              <a
                href={item.github_issue_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-words whitespace-normal md:truncate"
              >
                {item.full_path}
              </a>
              <ExternalLinkIcon />
            </div>
          ) : (
            item.full_path
          )}
        </div>
      </td>
      <td
        className={`hidden md:table-cell py-2 px-2 border-r text-center ${isExcluded ? "text-gray-400" : ""}`}
      >
        {formatFileSize(item.file_size)}
      </td>
      <td
        className={`hidden md:table-cell py-2 px-2 border-r text-center ${isExcluded ? "text-gray-400" : ""}`}
      >
        {formatPercentage(item.statement_coverage)}
      </td>
      <td
        className={`hidden md:table-cell py-2 px-2 border-r text-center ${isExcluded ? "text-gray-400" : ""}`}
      >
        {formatPercentage(item.function_coverage)}
      </td>
      <td
        className={`hidden md:table-cell py-2 px-2 border-r text-center ${isExcluded ? "text-gray-400" : ""}`}
      >
        {formatPercentage(item.branch_coverage)}
      </td>
      <td
        className={`md:hidden py-2 px-2 border-r text-center ${isExcluded ? "text-gray-400" : ""}`}
      >
        {selectedMobileMetric === "size"
          ? formatFileSize(item.file_size)
          : formatPercentage(getMetricValue(item, selectedMobileMetric))}
      </td>
    </tr>
  );
}

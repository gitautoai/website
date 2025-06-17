import { CoverageData, Metric } from "../types";
import { formatFileSize } from "@/utils/format-file-size";
import { formatPercentage } from "@/utils/format-percentage";
import { getLevelStyle } from "../utils/get-level-style";
import { getMetricValue } from "../utils/get-metric-value";
import ExternalLinkIcon from "@/app/components/icon/ExternalLinkIcon";

interface TableRowProps {
  item: CoverageData;
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
  return (
    <tr className={`hover:bg-pink-50 border-b ${getLevelStyle(item.level)}`}>
      <td
        className={`py-2 px-2 border-r text-center align-middle ${
          item.level === "file" ? "cursor-pointer" : ""
        }`}
        onClick={() => item.level === "file" && onSelectRow(item.id)}
      >
        {item.level === "file" && (
          <input
            type="checkbox"
            checked={selectedRows.includes(item.id)}
            readOnly
            className="rounded"
          />
        )}
      </td>
      <td
        className="py-2 px-2 border-r break-words whitespace-normal md:truncate"
        title={item.full_path}
      >
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
      </td>
      <td className="hidden md:table-cell py-2 px-2 border-r text-center">
        {formatFileSize(item.file_size)}
      </td>
      <td className="hidden md:table-cell py-2 px-2 border-r text-center">
        {formatPercentage(item.statement_coverage)}
      </td>
      <td className="hidden md:table-cell py-2 px-2 border-r text-center">
        {formatPercentage(item.function_coverage)}
      </td>
      <td className="hidden md:table-cell py-2 px-2 border-r text-center">
        {formatPercentage(item.branch_coverage)}
      </td>
      <td className="md:hidden py-2 px-2 border-r text-center">
        {selectedMobileMetric === "size"
          ? formatFileSize(item.file_size)
          : formatPercentage(getMetricValue(item, selectedMobileMetric))}
      </td>
    </tr>
  );
}

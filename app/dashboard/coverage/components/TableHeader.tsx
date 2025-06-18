import { SortField, SortDirection, Metric } from "../types";
import { getSortFieldForMetric } from "../utils/get-sort-field-for-metric";
import { getMetricHeader } from "../utils/get-metric-header";
import SortIcon from "@/app/components/icons/SortIcon";

interface TableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  selectedMobileMetric: Metric;
  selectedRows: number[];
  filteredData: any[];
  onSelectAll: () => void;
}

export default function TableHeader({
  sortField,
  sortDirection,
  onSort,
  selectedMobileMetric,
  selectedRows,
  filteredData,
  onSelectAll,
}: TableHeaderProps) {
  const HeaderCell = ({
    field,
    children,
    className = "",
    onClick,
  }: {
    field?: SortField;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <th
      className={`py-3 px-2 text-left text-gray-600 border-r cursor-pointer group font-normal ${className}`}
      onClick={onClick || (field ? () => onSort(field) : undefined)}
    >
      <div
        className={`flex items-center ${
          field === "full_path" ? "justify-start" : "justify-center"
        }`}
      >
        <span>{children}</span>
        {field && sortField === field && <SortIcon direction={sortDirection} />}
      </div>
    </th>
  );

  return (
    <thead className="sticky top-0 z-10 border-t">
      <tr className="bg-gray-50 border-b">
        <th className="py-3 px-2 w-10 border-r font-normal cursor-pointer" onClick={onSelectAll}>
          <input
            type="checkbox"
            checked={
              selectedRows.length > 0 &&
              selectedRows.length === filteredData.filter((item) => item.level === "file").length &&
              filteredData
                .filter((item) => item.level === "file")
                .every((item) => selectedRows.includes(item.id))
            }
            readOnly
            className="rounded"
          />
        </th>

        <HeaderCell field="full_path" className="w-auto text-left">
          Path
        </HeaderCell>

        <HeaderCell field="file_size" className="hidden md:table-cell w-20 text-center">
          Size
        </HeaderCell>

        <HeaderCell field="statement_coverage" className="hidden md:table-cell w-20 text-center">
          Stmt
        </HeaderCell>

        <HeaderCell field="function_coverage" className="hidden md:table-cell w-20 text-center">
          Func
        </HeaderCell>

        <HeaderCell field="branch_coverage" className="hidden md:table-cell w-20 text-center">
          Brch
        </HeaderCell>

        <HeaderCell
          field={getSortFieldForMetric(selectedMobileMetric)}
          className="md:hidden w-16 text-center"
        >
          {getMetricHeader(selectedMobileMetric)}
        </HeaderCell>
      </tr>
    </thead>
  );
}

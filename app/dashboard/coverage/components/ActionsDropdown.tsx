import { ParentIssue, CoverageData } from "../types";
import SpinnerIcon from "@/app/components/SpinnerIcon";

interface ActionsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedRows: number[];
  isCreatingIssues: boolean;
  onCreateIssues: (hasLabel: boolean) => void;
}

export default function ActionsDropdown({
  isOpen,
  onToggle,
  selectedRows,
  isCreatingIssues,
  onCreateIssues,
}: ActionsDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors flex items-center gap-2"
      >
        {isCreatingIssues ? (
          <>
            <SpinnerIcon white />
            <span>Actions</span>
          </>
        ) : (
          "Actions"
        )}
        <span className="text-sm border-l border-pink-400 pl-2">▼</span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg py-1 min-w-[200px] z-20">
            <button
              onClick={() => {
                onCreateIssues(false);
                onToggle();
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap min-w-[200px]"
              disabled={isCreatingIssues || selectedRows.length === 0}
            >
              {isCreatingIssues ? (
                <>
                  <SpinnerIcon />
                  <span>Creating Issues...</span>
                </>
              ) : (
                `Create Issues (${selectedRows.length})`
              )}
            </button>
            <button
              onClick={() => {
                onCreateIssues(true);
                onToggle();
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap min-w-[200px]"
              disabled={isCreatingIssues || selectedRows.length === 0}
            >
              {isCreatingIssues ? (
                <>
                  <SpinnerIcon />
                  <span>Creating Issues & PRs...</span>
                </>
              ) : (
                `Create Issues & PRs (${selectedRows.length})`
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import SpinnerIcon from "@/app/components/SpinnerIcon";
import { Tables } from "@/types/supabase";

interface ActionsDropdownProps {
  isOpen: boolean;
  onToggleDropdown: () => void;
  selectedRows: number[];
  isCreatingIssues: boolean;
  onCreateIssues: (hasLabel: boolean) => void;
  onToggleExclusion: (isExcluded: boolean) => void;
  isTogglingExclusion: boolean;
  selectedData: Tables<"coverages">[];
}

export default function ActionsDropdown({
  isOpen,
  onToggleDropdown,
  selectedRows,
  isCreatingIssues,
  onCreateIssues,
  onToggleExclusion,
  isTogglingExclusion,
  selectedData,
}: ActionsDropdownProps) {
  const hasExcludedFiles = selectedData.some((item) => item.is_excluded_from_testing);
  const hasIncludedFiles = selectedData.some((item) => !item.is_excluded_from_testing);

  const ExclusionButton = ({ isExcluding, label }: { isExcluding: boolean; label: string }) => (
    <button
      onClick={() => {
        onToggleExclusion(isExcluding);
        onToggleDropdown();
      }}
      className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap min-w-[200px]"
      disabled={isCreatingIssues || isTogglingExclusion || selectedRows.length === 0}
    >
      {isTogglingExclusion ? (
        <>
          <SpinnerIcon />
          <span>{isExcluding ? "Excluding..." : "Including..."}</span>
        </>
      ) : (
        `${label} (${selectedRows.length})`
      )}
    </button>
  );

  return (
    <div className="relative">
      <button
        onClick={onToggleDropdown}
        className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors flex items-center gap-2"
      >
        {isCreatingIssues || isTogglingExclusion ? (
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
          <div className="fixed inset-0 z-10" onClick={onToggleDropdown} />
          <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg py-1 min-w-[200px] z-20">
            <button
              onClick={() => {
                onCreateIssues(false);
                onToggleDropdown();
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap min-w-[200px]"
              disabled={isCreatingIssues || isTogglingExclusion || selectedRows.length === 0}
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
                onToggleDropdown();
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap min-w-[200px]"
              disabled={isCreatingIssues || isTogglingExclusion || selectedRows.length === 0}
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

            {hasIncludedFiles && (
              <ExclusionButton isExcluding={true} label="Exclude from Testing" />
            )}

            {hasExcludedFiles && <ExclusionButton isExcluding={false} label="Include in Testing" />}
          </div>
        </>
      )}
    </div>
  );
}

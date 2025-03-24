"use client";
import { useEffect, useState, useCallback } from "react";
import RepositorySelector from "../components/RepositorySelector";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAccountContext } from "@/components/Context/Account";
import SpinnerIcon from "@/components/SpinnerIcon";
import { fetchWithTiming } from "@/utils/fetch";
import { CoverageData, SortField, SortDirection } from "./types";
import Help from "@/components/Help";
import SuccessPopup from "@/components/SuccessPopup";

type IssueResponse = {
  coverageId: number;
  issueUrl: string;
};

export default function CoveragePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    currentOwnerId,
    currentOwnerName,
    currentRepoId,
    currentRepoName,
    currentInstallationId,
    userName,
    accessToken,
  } = useAccountContext();
  const [coverageData, setCoverageData] = useState<CoverageData[]>([]);
  const [packageNames, setPackageNames] = useState<string[]>([]);
  const [levels] = useState<CoverageData["level"][]>(["repository", "directory", "file"]);

  // Filters
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [hideFullCoverage, setHideFullCoverage] = useState<"all" | "hide">("hide");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("statement_coverage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Selected rows for Issue creation
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isCreatingIssues, setIsCreatingIssues] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // New state for mobile metric selection
  const [selectedMobileMetric, setSelectedMobileMetric] = useState<
    "statement" | "function" | "branch"
  >("statement");

  // Add state for success popup
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchCoverageData = useCallback(async () => {
    if (!currentRepoName || !currentOwnerName || !currentOwnerId || !currentRepoId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(`/api/supabase/get-coverage-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId: currentOwnerId, repoId: currentRepoId }),
      });
      if (!response.ok) throw new Error("Failed to fetch coverage data");

      const data = await response.json();
      setCoverageData(data);

      // Extract unique package names and levels for filters
      const packagesSet = new Set<string>();
      const levelsSet = new Set<string>();

      data.forEach((item: CoverageData) => {
        if (item.package_name) packagesSet.add(item.package_name);
        if (item.level) levelsSet.add(item.level);
      });

      setPackageNames(Array.from(packagesSet));
    } catch (error) {
      setError("Failed to load coverage data");
      console.error("Error loading coverage data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentRepoName, currentOwnerName, currentOwnerId, currentRepoId]);

  useEffect(() => {
    fetchCoverageData();
  }, [fetchCoverageData]);

  useEffect(() => {
    setSelectedLevel(localStorage.getItem("selectedCoverageLevel") || "");
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending for coverage metrics, ascending for text
      const isNumeric = [
        "statement_coverage",
        "function_coverage",
        "branch_coverage",
        "line_coverage",
      ].includes(field);
      setSortField(field);
      setSortDirection(isNumeric ? "desc" : "asc");
    }
  };

  const handleSelectAll = () => {
    const isCurrentlySelected =
      selectedRows.length > 0 && selectedRows.length === filteredData.length;
    if (!isCurrentlySelected) {
      setSelectedRows(filteredData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleCreateIssues = async () => {
    if (selectedRows.length === 0) return;

    setIsCreatingIssues(true);
    try {
      const selectedCoverages = coverageData.filter((item) => selectedRows.includes(item.id));

      const { issues } = await fetchWithTiming<{ issues: IssueResponse[] }>(
        "/api/github/create-coverage-issues",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedCoverages,
            ownerName: currentOwnerName,
            repoName: currentRepoName,
            accessToken,
          }),
        }
      );

      // Update local state with new issue URLs
      setCoverageData((prevData) =>
        prevData.map((item) => {
          const issue = issues.find((i) => i.coverageId === item.id);
          if (issue) return { ...item, github_issue_url: issue.issueUrl };

          return item;
        })
      );

      setSelectedRows([]);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating issues:", error);
      setError(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to create issues"
      );
    } finally {
      setIsCreatingIssues(false);
    }
  };

  const formatPercentage = (value: number | null) => {
    if (value === null || isNaN(value)) return "0%";
    return `${Math.floor(value)}%`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        weekday: "short", // "Sun"
        month: "short", // "Mar"
        day: "numeric", // "23"
        hour: "numeric", // "4"
        minute: "2-digit", // "13"
        hour12: true, // PM/AM
      })
      .replace(",", "")
      .replace(/\s+/g, " ");
  };

  const getLatestUpdate = () => {
    if (coverageData.length === 0) return null;
    const latestDate = coverageData.reduce((latest, item) => {
      const itemDate = new Date(item.updated_at);
      return latest > itemDate ? latest : itemDate;
    }, new Date(0));
    return formatDateTime(latestDate.toISOString());
  };

  // Apply filters
  const filteredData = coverageData
    .filter((item) => !selectedPackage || item.package_name === selectedPackage)
    .filter((item) => !selectedLevel || item.level === selectedLevel)
    .filter(
      (item) =>
        hideFullCoverage !== "hide" ||
        !(
          item.statement_coverage === 100 &&
          item.function_coverage === 100 &&
          item.branch_coverage === 100 &&
          item.line_coverage === 100
        )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparison
      const aString = String(aValue || "");
      const bString = String(bValue || "");
      return sortDirection === "asc"
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });

  // Get level-specific styling
  const getLevelStyle = (level: string): string => {
    switch (level) {
      case "repository":
        return "bg-blue-50";
      case "directory":
        return "bg-green-50";
      case "file":
        return "";
      default:
        return "";
    }
  };

  // Check if we have any package names to show the filter
  const hasPackages = packageNames.length > 0;

  const refreshCoverage = async () => {
    if (!currentRepoName || !currentOwnerName || !currentOwnerId || !currentRepoId) {
      setError("Please select a repository first");
      return;
    }

    try {
      setIsRefreshing(true);
      setError(null);

      await fetchWithTiming(`/api/proxy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: "/api/repository/coverage",
          data: {
            owner_id: currentOwnerId,
            owner_name: currentOwnerName,
            repo_id: currentRepoId,
            repo_name: currentRepoName,
            installation_id: currentInstallationId,
            user_name: userName,
          },
        }),
      });

      await fetchCoverageData();
    } catch (error) {
      console.error("Error refreshing coverage:", error);
      setError(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to refresh coverage data"
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    localStorage.setItem("selectedCoverageLevel", value);
  };

  const getLevelCounts = () => {
    const counts = { repository: 0, directory: 0, file: 0 };
    filteredData.forEach((item) => {
      if (item.level in counts) counts[item.level as keyof typeof counts]++;
    });
    return counts;
  };

  // New function to get coverage value based on selected mobile metric
  const getCoverageValue = (item: CoverageData, metric: "statement" | "function" | "branch") => {
    switch (metric) {
      case "statement":
        return item.statement_coverage;
      case "function":
        return item.function_coverage;
      case "branch":
        return item.branch_coverage;
      default:
        return 0;
    }
  };

  // Mobile Coverage Metric Selector Header
  const getMobileHeaderText = (metric: "statement" | "function" | "branch") => {
    switch (metric) {
      case "statement":
        return "Stmt";
      case "function":
        return "Func";
      case "branch":
        return "Brch";
      default:
        return "Stmt";
    }
  };

  // Mobile Coverage Metric Sort Field
  const getMobileSortField = (metric: "statement" | "function" | "branch"): SortField => {
    switch (metric) {
      case "statement":
        return "statement_coverage";
      case "function":
        return "function_coverage";
      case "branch":
        return "branch_coverage";
      default:
        return "statement_coverage";
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="w-7/12 lg:w-auto flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Coverage Dashboard</h1>
        <Help helpKey="coverage-dashboard" />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <RepositorySelector />

      {/* Package Name Selector */}
      <div className="mt-6 flex flex-wrap gap-4 items-end">
        {hasPackages && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Package Name</label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="p-2 border rounded-md w-48"
              disabled={isLoading}
            >
              <option value="">All Packages</option>
              {packageNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Level Selector */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="p-2 border rounded-md w-48"
            disabled={isLoading}
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Coverage Filter */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Coverage Filter</label>
          <select
            value={hideFullCoverage}
            onChange={(e) => setHideFullCoverage(e.target.value as "all" | "hide")}
            className="p-2 border rounded-md w-48"
            disabled={isLoading}
          >
            <option value="all">Show All</option>
            <option value="hide">Hide All 100%</option>
          </select>
        </div>

        {/* Mobile Coverage Metric Selector */}
        <div className="lg:hidden">
          <label className="block text-sm text-gray-600 mb-1">Coverage Metric</label>
          <select
            value={selectedMobileMetric}
            onChange={(e) => {
              const newMetric = e.target.value as "statement" | "function" | "branch";
              setSelectedMobileMetric(newMetric);
              setSortField(getMobileSortField(newMetric));
              setSortDirection("desc");
            }}
            className="p-2 border rounded-md w-48"
          >
            <option value="statement">Statement Coverage</option>
            <option value="function">Function Coverage</option>
            <option value="branch">Branch Coverage</option>
          </select>
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
            {isRefreshing || isCreatingIssues ? (
              <>
                <SpinnerIcon white />
                <span>Actions</span>
              </>
            ) : (
              "Actions"
            )}
            <span className="text-sm border-l border-pink-400 pl-2">▼</span>
          </button>
          {isActionsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsActionsOpen(false)} />
              <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg py-1 min-w-[200px] z-20">
                <button
                  onClick={() => {
                    refreshCoverage();
                    setIsActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                  disabled={isRefreshing || !currentRepoName}
                >
                  {isRefreshing ? (
                    <>
                      <SpinnerIcon />
                      <span>Refreshing...</span>
                    </>
                  ) : (
                    "Refresh Coverage"
                  )}
                </button>
                <button
                  onClick={() => {
                    handleCreateIssues();
                    setIsActionsOpen(false);
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
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 mb-4 lg:mb-2 lg:items-center">
          <div className="flex gap-4">
            {Object.entries(getLevelCounts()).map(([level, count]) => (
              <div key={level} className="text-sm text-gray-600">
                <span className="capitalize">{level}:</span> {count}
              </div>
            ))}
          </div>
          {getLatestUpdate() && (
            <div className="text-sm text-gray-600">Last updated: {getLatestUpdate()}</div>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[90vh] overflow-y-auto">
            <table className="w-full bg-white border table-fixed">
              <thead className="sticky top-0 z-10 border-t">
                <tr className="bg-gray-50 border-b">
                  <th
                    className="py-3 px-2 w-10 border-r font-normal cursor-pointer"
                    onClick={handleSelectAll}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length > 0 && selectedRows.length === filteredData.length
                      }
                      readOnly
                      className="rounded"
                    />
                  </th>
                  <th
                    className="py-3 px-2 text-left text-gray-600 border-r w-full lg:w-8/12 cursor-pointer group font-normal"
                    onClick={() => handleSort("full_path")}
                  >
                    <div className="flex items-center">
                      <span>Path</span>
                      {sortField === "full_path" && (
                        <span className="ml-1 text-gray-400">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="hidden lg:table-cell py-3 px-2 text-center text-gray-600 border-r w-1/8 cursor-pointer group font-normal"
                    onClick={() => handleSort("statement_coverage")}
                  >
                    <div className="flex items-center justify-center">
                      <span>Stmt</span>
                      {sortField === "statement_coverage" && (
                        <span className="ml-1 text-gray-400">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="hidden lg:table-cell py-3 px-2 text-center text-gray-600 border-r w-1/8 cursor-pointer group font-normal"
                    onClick={() => handleSort("function_coverage")}
                  >
                    <div className="flex items-center justify-center">
                      <span>Func</span>
                      {sortField === "function_coverage" && (
                        <span className="ml-1 text-gray-400">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="hidden lg:table-cell py-3 px-2 text-center text-gray-600 border-r w-1/8 cursor-pointer group font-normal"
                    onClick={() => handleSort("branch_coverage")}
                  >
                    <div className="flex items-center justify-center">
                      <span>Brch</span>
                      {sortField === "branch_coverage" && (
                        <span className="ml-1 text-gray-400">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Mobile Coverage Metric Header */}
                  <th
                    className="lg:hidden py-3 px-2 text-center text-gray-600 border-r w-3/12 cursor-pointer group font-normal"
                    onClick={() => handleSort(getMobileSortField(selectedMobileMetric))}
                  >
                    <div className="flex items-center justify-center">
                      <span>{getMobileHeaderText(selectedMobileMetric)}</span>
                      {sortField === getMobileSortField(selectedMobileMetric) && (
                        <span className="ml-1 text-gray-400">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center border">
                      No coverage data available
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-pink-50 border-b ${getLevelStyle(item.level)}`}
                    >
                      <td
                        className="py-2 px-2 border-r text-center align-middle cursor-pointer"
                        onClick={() => handleSelectRow(item.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          readOnly
                          className="rounded"
                        />
                      </td>
                      <td
                        className="py-2 px-2 border-r break-words whitespace-normal lg:truncate"
                        title={item.full_path}
                      >
                        {item.github_issue_url ? (
                          <div className="flex items-center gap-2 text-pink-600 hover:text-pink-700 visited:text-pink-700">
                            <a
                              href={item.github_issue_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block break-words whitespace-normal lg:truncate"
                            >
                              {item.full_path}
                            </a>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                        ) : (
                          item.full_path
                        )}
                      </td>
                      {/* Desktop cells */}
                      <td className="hidden lg:table-cell py-2 px-2 border-r text-center">
                        {formatPercentage(item.statement_coverage)}
                      </td>
                      <td className="hidden lg:table-cell py-2 px-2 border-r text-center">
                        {formatPercentage(item.function_coverage)}
                      </td>
                      <td className="hidden lg:table-cell py-2 px-2 border-r text-center">
                        {formatPercentage(item.branch_coverage)}
                      </td>
                      {/* Mobile cell */}
                      <td className="lg:hidden py-2 px-2 border-r text-center">
                        {formatPercentage(getCoverageValue(item, selectedMobileMetric))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isLoading && !isRefreshing && <LoadingSpinner />}

      {showSuccess && (
        <SuccessPopup
          message="Issues created successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}

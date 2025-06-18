"use client";

// Third-party imports
import { useEffect, useState } from "react";

// Local imports (Absolute imports)
import { syncRepositoryFiles } from "@/app/actions/sync-repository-files";
import { useAccountContext } from "@/app/components/Context/Account";
import DocsLink from "@/app/components/DocsLink";
import ErrorBanner from "@/app/components/ErrorBanner";
import FilterSelect from "@/app/components/FilterSelect";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SyncModal from "@/app/components/SyncModal";
import Toast from "@/app/components/Toast";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import { STORAGE_KEYS } from "@/lib/constants";

// Local imports (Relative imports)
import ActionsDropdown from "./components/ActionsDropdown";
import CoverageStats from "./components/CoverageStats";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import {
  createLevelOptions,
  createPackageOptions,
  createParentIssueOptions,
  COVERAGE_FILTER_OPTIONS,
  MOBILE_METRIC_OPTIONS,
} from "./constants/filter-options";
import { SYNC_MESSAGES } from "./constants/sync-messages";
import { fetchCoverageData } from "./handlers/fetch-coverage-data";
import { fetchOpenIssues } from "./handlers/fetch-open-issues";
import { handleCreateIssues } from "./handlers/handle-create-issues";
import { handleSelectAll } from "./handlers/handle-select-all";
import { handleSelectRow } from "./handlers/handle-select-row";
import { handleSort } from "./handlers/handle-sort";
import { CoverageData, Metric, ParentIssue, SortDirection, SortField } from "./types";
import { filterAndSortData } from "./utils/filter-and-sort-data";
import { getSortFieldForMetric } from "./utils/get-sort-field-for-metric";

export default function CoveragePage() {
  const {
    currentOwnerId,
    currentOwnerName,
    currentRepoId,
    currentRepoName,
    accessToken,
    userId,
    userName,
  } = useAccountContext();

  // Loading states
  const [isLoadingDB, setIsLoadingDB] = useState(true);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [gitHubSyncStatus, setGitHubSyncStatus] = useState<"loading" | "success" | "error" | null>(
    null
  );
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isCreatingIssues, setIsCreatingIssues] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [coverageData, setCoverageData] = useState<CoverageData[]>([]);
  const [packageNames, setPackageNames] = useState<string[]>([]);
  const [levels] = useState<CoverageData["level"][]>(["repository", "directory", "file"]);
  const [openIssues, setOpenIssues] = useState<ParentIssue[]>([]);

  // UI states
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [hideFullCoverage, setHideFullCoverage] = useState<"all" | "hide">("hide");
  const [selectedParentIssue, setSelectedParentIssue] = useState<ParentIssue | null>(null);
  const [selectedMobileMetric, setSelectedMobileMetric] = useState<Metric>("statement");
  const [sortField, setSortField] = useState<SortField>("statement_coverage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Load sort settings from localStorage
  useEffect(() => {
    const savedSortField = localStorage.getItem(STORAGE_KEYS.SORT_FIELD) as SortField;
    const savedSortDirection = localStorage.getItem(STORAGE_KEYS.SORT_DIRECTION) as SortDirection;

    if (savedSortField) setSortField(savedSortField);
    if (savedSortDirection) setSortDirection(savedSortDirection);
  }, []);

  // Fetch coverage data
  useEffect(() => {
    const loadDataAndSync = async () => {
      if (!currentOwnerId || !currentRepoId) return;

      // First, fetch data from the database
      const coverageData = await fetchCoverageData(
        currentOwnerId,
        currentRepoId,
        setCoverageData,
        setPackageNames,
        setError,
        setIsLoadingDB
      );

      // After data is fetched, perform sync
      if (!currentOwnerName || !currentRepoName || !accessToken || !userId) return;

      const hasNoData = coverageData.length === 0;

      try {
        if (hasNoData) setGitHubSyncStatus("loading");

        const result = await syncRepositoryFiles(
          currentOwnerName,
          currentRepoName,
          currentOwnerId,
          currentRepoId,
          accessToken,
          userId,
          userName,
          coverageData
        );

        if (hasNoData) setGitHubSyncStatus("success");

        // If there are changes, refetch the data
        if (result.inserted > 0 || result.updated > 0 || result.deleted > 0) {
          await fetchCoverageData(
            currentOwnerId,
            currentRepoId,
            setCoverageData,
            setPackageNames,
            setError,
            setIsLoadingDB
          );
        }

        if (hasNoData) setTimeout(() => setGitHubSyncStatus(null), 3000);
      } catch (error) {
        console.error("Sync failed:", error);
        if (hasNoData) {
          setGitHubSyncStatus("error");
          setTimeout(() => setGitHubSyncStatus(null), 5000);
        }
      }
    };

    loadDataAndSync();
  }, [currentOwnerId, currentRepoId, currentOwnerName, currentRepoName, accessToken, userId]);

  // Load selected level from localStorage if it exists
  useEffect(() => {
    setSelectedLevel(localStorage.getItem("selectedCoverageLevel") || "");
  }, []);

  // When repository changes, update parent issue list
  useEffect(() => {
    if (!currentOwnerName || !currentRepoName || !accessToken) return;

    fetchOpenIssues(
      currentOwnerName,
      currentRepoName,
      accessToken,
      setOpenIssues,
      setSelectedParentIssue,
      setIsLoadingIssues,
      setError
    );
  }, [currentOwnerName, currentRepoName, accessToken]);

  // Apply filters and sorting
  const filteredData = filterAndSortData(
    coverageData,
    selectedPackage,
    selectedLevel,
    hideFullCoverage,
    sortField,
    sortDirection
  );

  // Check if we have any package names to show the filter
  const hasPackages = packageNames.length > 0;

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    localStorage.setItem("selectedCoverageLevel", value);
  };

  return (
    <div className="relative min-h-screen">
      <div className="w-7/12 md:w-auto flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Coverage Dashboard</h1>
        <DocsLink />
      </div>

      <ErrorBanner error={error} />
      <RepositorySelector />

      {/* Filters */}
      <div className="mt-4 md:mt-6 grid grid-cols-2 gap-4 md:flex md:flex-wrap md:gap-4 md:items-end">
        {hasPackages && (
          <div className="col-span-2 md:col-span-1">
            <FilterSelect
              label="Package Name"
              value={selectedPackage}
              onChange={setSelectedPackage}
              options={createPackageOptions(packageNames)}
              disabled={isLoadingDB}
            />
          </div>
        )}

        <FilterSelect
          label="Level"
          value={selectedLevel}
          onChange={handleLevelChange}
          options={createLevelOptions(levels)}
          disabled={isLoadingDB}
        />

        <FilterSelect
          label="Coverage Filter"
          value={hideFullCoverage}
          onChange={(value) => setHideFullCoverage(value as "all" | "hide")}
          options={COVERAGE_FILTER_OPTIONS}
          disabled={isLoadingDB}
        />

        <div className="md:hidden">
          <FilterSelect
            label="Coverage Metric"
            value={selectedMobileMetric}
            onChange={(value) => {
              const newMetric = value as Metric;
              setSelectedMobileMetric(newMetric);
              setSortField(getSortFieldForMetric(newMetric));
              setSortDirection("desc");
            }}
            options={MOBILE_METRIC_OPTIONS}
          />
        </div>

        <div className="relative">
          <FilterSelect
            label="Parent Issue (Optional)"
            value={selectedParentIssue?.number.toString() || ""}
            onChange={(value) => {
              const issue = openIssues.find((i) => i.number.toString() === value);
              setSelectedParentIssue(issue || null);
            }}
            options={createParentIssueOptions(openIssues)}
            disabled={isLoadingIssues}
          />
        </div>

        <ActionsDropdown
          isOpen={isActionsOpen}
          onToggle={() => setIsActionsOpen(!isActionsOpen)}
          selectedRows={selectedRows}
          isCreatingIssues={isCreatingIssues}
          onCreateIssues={(hasLabel) => {
            if (!currentOwnerName || !currentRepoName || !accessToken) {
              setError("Missing required repository information");
              return;
            }

            handleCreateIssues({
              selectedRows,
              coverageData,
              currentOwnerName,
              currentRepoName,
              accessToken,
              selectedParentIssue,
              hasLabel,
              setCoverageData,
              setSelectedRows,
              setActionSuccess,
              setError,
              setIsCreatingIssues,
            });
          }}
        />
      </div>

      <div className="mt-4 md:mt-6">
        <CoverageStats filteredData={filteredData} coverageData={coverageData} />

        <div className="overflow-x-auto">
          <div className="max-h-[90vh] overflow-y-auto">
            <table className="w-full bg-white border table-fixed">
              <TableHeader
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={(field) =>
                  handleSort(field, sortField, sortDirection, setSortField, setSortDirection)
                }
                selectedMobileMetric={selectedMobileMetric}
                selectedRows={selectedRows}
                filteredData={filteredData}
                onSelectAll={() => handleSelectAll(filteredData, selectedRows, setSelectedRows)}
              />
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-center border">
                      No coverage data available
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <TableRow
                      key={item.id}
                      item={item}
                      selectedRows={selectedRows}
                      onSelectRow={(id) => handleSelectRow(selectedRows, setSelectedRows, id)}
                      selectedMobileMetric={selectedMobileMetric}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isLoadingDB && <LoadingSpinner />}

      {actionSuccess && (
        <Toast
          message="Action completed successfully!"
          type="success"
          onClose={() => setActionSuccess(false)}
        />
      )}

      {/* If no data exists: show modal in the center of the screen */}
      {!isLoadingDB && coverageData.length === 0 && gitHubSyncStatus && (
        <SyncModal message={SYNC_MESSAGES[gitHubSyncStatus]} type={gitHubSyncStatus} />
      )}
    </div>
  );
}

"use client";

// Third-party imports
import { useEffect, useState } from "react";

// Local imports (Actions)
import { toggleExclusion } from "@/app/actions/supabase/coverage/toggle-exclusion";
import { syncRepositoryFiles } from "@/app/actions/sync-repository-files";

// Local imports (Components and others)
import { useAccountContext } from "@/app/components/contexts/Account";
import DocsLink from "@/app/components/DocsLink";
import ErrorBanner from "@/app/components/ErrorBanner";
import FilterSelect from "@/app/components/FilterSelect";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";
import Toast from "@/app/components/Toast";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import { RELATIVE_URLS } from "@/config/urls";
import { STORAGE_KEYS } from "@/lib/constants";
import { pollUntil } from "@/lib/polling";
import { Tables } from "@/types/supabase";

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
  EXCLUSION_FILTER_OPTIONS,
  MOBILE_METRIC_OPTIONS,
} from "./constants/filter-options";
import { SYNC_MESSAGES } from "./constants/sync-messages";
import { fetchCoverageData } from "./handlers/fetch-coverage-data";
import { fetchOpenIssues } from "./handlers/fetch-open-issues";
import { handleCreateIssues } from "./handlers/handle-create-issues";
import { handleSelectAll } from "./handlers/handle-select-all";
import { handleSelectRow } from "./handlers/handle-select-row";
import { handleSort } from "./handlers/handle-sort";
import { Metric, ParentIssue, SortDirection, SortField } from "./types";
import { filterAndSortData } from "./utils/filter-and-sort-data";
import { getSortFieldForMetric } from "./utils/get-sort-field-for-metric";

export default function CoveragePage() {
  const {
    currentOwnerId,
    currentOwnerName,
    currentRepoId,
    currentRepoName,
    setCurrentRepoName,
    organizations,
    accessToken,
    currentInstallationId,
    userId,
    userName,
  } = useAccountContext();

  // Auto-select first repo if "__ALL__" is selected (coverage page doesn't support all repos)
  useEffect(() => {
    if (currentRepoName === "__ALL__" && currentOwnerName && organizations.length > 0) {
      const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
      if (currentOrg && currentOrg.repositories.length > 0) {
        setCurrentRepoName(currentOrg.repositories[0].repoName);
      }
    }
  }, [currentRepoName, currentOwnerName, organizations, setCurrentRepoName]);

  // Loading states
  const [isLoadingDB, setIsLoadingDB] = useState(true);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [gitHubSyncStatus, setGitHubSyncStatus] = useState<"loading" | "error" | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isCreatingIssues, setIsCreatingIssues] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [coverageData, setCoverageData] = useState<Tables<"coverages">[]>([]);
  const [packageNames, setPackageNames] = useState<string[]>([]);
  const [levels] = useState<Tables<"coverages">["level"][]>(["repository", "directory", "file"]);
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
  const [selectedExclusionFilter, setSelectedExclusionFilter] = useState<string>("");
  const [isTogglingExclusion, setIsTogglingExclusion] = useState(false);

  // Load sort settings from localStorage
  useEffect(() => {
    const savedSortField = localStorage.getItem(STORAGE_KEYS.SORT_FIELD) as SortField;
    const savedSortDirection = localStorage.getItem(STORAGE_KEYS.SORT_DIRECTION) as SortDirection;

    if (savedSortField) setSortField(savedSortField);
    if (savedSortDirection) setSortDirection(savedSortDirection);
  }, []);

  // Load filter settings from localStorage if it exists
  useEffect(() => {
    setSelectedLevel(localStorage.getItem("selectedCoverageLevel") || "");
    setSelectedExclusionFilter(localStorage.getItem("selectedExclusionFilter") || "");
    setHideFullCoverage((localStorage.getItem("hideFullCoverage") as "all" | "hide") || "hide");
  }, []);

  // Fetch coverage data
  useEffect(() => {
    const abortController = new AbortController();

    const loadDataAndSync = async () => {
      if (!currentOwnerId || !currentRepoId) {
        setIsLoadingDB(false);
        return;
      }

      // First, fetch data from the database
      const coverageData = await fetchCoverageData(
        currentOwnerId,
        currentRepoId,
        setCoverageData,
        setPackageNames,
        setError,
        setIsLoadingDB,
      );

      if (abortController.signal.aborted) return;

      // After data is fetched, perform sync
      if (!currentOwnerName || !currentRepoName || !currentInstallationId || !userName) return;
      if (currentRepoName === "__ALL__") return; // Skip sync if "All Repositories" is selected

      const hasNoData = coverageData.length === 0;

      // Check if we synced recently (within 5 minutes) to avoid redundant syncs
      const SYNC_DEBOUNCE_MS = 5 * 60 * 1000;
      const POLL_INTERVAL_MS = 10 * 1000;
      const POLL_TIMEOUT_MS = 3 * 60 * 1000;
      const syncKey = `lastSync_${currentOwnerId}_${currentRepoId}`;
      const lastSync = localStorage.getItem(syncKey);
      const now = Date.now();

      if (lastSync && now - parseInt(lastSync, 10) < SYNC_DEBOUNCE_MS) {
        // Show last sync time if we have it and no data
        if (hasNoData) {
          const elapsed = now - parseInt(lastSync, 10);
          const mins = Math.floor(elapsed / 60000);
          setLastSyncTime(mins < 1 ? "just now" : `${mins} min ago`);
        }
        return;
      }

      try {
        if (hasNoData) setGitHubSyncStatus("loading");

        // Trigger background sync - returns immediately, sync happens on Lambda
        await syncRepositoryFiles(
          currentOwnerName,
          currentRepoName,
          currentOwnerId,
          currentRepoId,
          currentInstallationId,
          userName,
        );

        if (abortController.signal.aborted) return;

        localStorage.setItem(syncKey, now.toString());

        // Poll for data if no data exists (silent mode to avoid UI flickering)
        if (hasNoData) {
          const found = await pollUntil(
            async () => {
              const data = await fetchCoverageData(
                currentOwnerId,
                currentRepoId,
                setCoverageData,
                setPackageNames,
                setError,
                setIsLoadingDB,
                { silent: true },
              );
              return data && data.length > 0;
            },
            {
              intervalMs: POLL_INTERVAL_MS,
              timeoutMs: POLL_TIMEOUT_MS,
              signal: abortController.signal,
            },
          );
          if (abortController.signal.aborted) return;
          setGitHubSyncStatus(null);
          if (!found) setLastSyncTime("just now");
        }
      } catch (error) {
        console.error("Sync failed:", error);
        if (hasNoData && !abortController.signal.aborted) {
          setGitHubSyncStatus("error");
          setTimeout(() => setGitHubSyncStatus(null), 5000);
        }
      }
    };

    loadDataAndSync();

    return () => abortController.abort();
  }, [
    currentOwnerId,
    currentRepoId,
    currentOwnerName,
    currentRepoName,
    currentInstallationId,
    userName,
  ]);

  // When repository changes, update parent issue list
  useEffect(() => {
    if (!currentOwnerName || !currentRepoName || !currentInstallationId) return;
    if (currentRepoName === "__ALL__") return; // Skip if "All Repositories" is selected

    fetchOpenIssues(
      currentOwnerName,
      currentRepoName,
      currentInstallationId,
      setOpenIssues,
      setSelectedParentIssue,
      setIsLoadingIssues,
      setError,
    );
  }, [currentOwnerName, currentRepoName, currentInstallationId]);

  // Apply filters and sorting
  const filteredData = filterAndSortData(
    coverageData,
    selectedPackage,
    selectedLevel,
    hideFullCoverage,
    selectedExclusionFilter,
    sortField,
    sortDirection,
  );

  // Get selected data for actions
  const selectedData = filteredData.filter((item) => selectedRows.includes(item.id));

  // Check if we have any package names to show the filter
  const hasPackages = packageNames.length > 0;

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    localStorage.setItem("selectedCoverageLevel", value);
  };

  const handleCoverageFilterChange = (value: string) => {
    const filterValue = value as "all" | "hide";
    setHideFullCoverage(filterValue);
    localStorage.setItem("hideFullCoverage", filterValue);
  };

  const handleExclusionFilterChange = (value: string) => {
    setSelectedExclusionFilter(value);
    localStorage.setItem("selectedExclusionFilter", value);
  };

  const handleToggleExclusion = async (isExcluded: boolean) => {
    if (!userId || !userName || selectedRows.length === 0) return;

    try {
      setIsTogglingExclusion(true);
      setError(null);

      await toggleExclusion(selectedRows, isExcluded, userId, userName);

      // Refresh data
      await fetchCoverageData(
        currentOwnerId,
        currentRepoId,
        setCoverageData,
        setPackageNames,
        setError,
        setIsLoadingDB,
      );

      setSelectedRows([]);
      setActionSuccess(true);
    } catch (error) {
      setError(`Failed to ${isExcluded ? "exclude" : "include"} files`);
    } finally {
      setIsTogglingExclusion(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="w-7/12 md:w-auto flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Coverage Dashboard</h1>
        <DocsLink href={RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW} />
      </div>

      <ErrorBanner error={error} />
      <RepositorySelector disableAllRepos={true} />

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
          onChange={handleCoverageFilterChange}
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

        <FilterSelect
          label="Exclusion Status"
          value={selectedExclusionFilter}
          onChange={handleExclusionFilterChange}
          options={EXCLUSION_FILTER_OPTIONS}
        />

        <ActionsDropdown
          isOpen={isActionsOpen}
          onToggleDropdown={() => setIsActionsOpen(!isActionsOpen)}
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
          onToggleExclusion={handleToggleExclusion}
          isTogglingExclusion={isTogglingExclusion}
          selectedData={selectedData}
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

      {/* If no data exists: show sync status or last sync time */}
      {!isLoadingDB && coverageData.length === 0 && gitHubSyncStatus && (
        <Modal
          title={gitHubSyncStatus === "loading" ? "Syncing Repository" : "Sync Failed"}
          type={gitHubSyncStatus}
          message={SYNC_MESSAGES[gitHubSyncStatus]}
        />
      )}
      {!isLoadingDB && coverageData.length === 0 && !gitHubSyncStatus && lastSyncTime && (
        <Modal
          title="Syncing Repository"
          type="loading"
          message={`Last triggered: ${lastSyncTime}. Refresh to check for updates.`}
        />
      )}
    </div>
  );
}

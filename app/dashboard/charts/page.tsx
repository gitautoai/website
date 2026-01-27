"use client";

import { useEffect, useState } from "react";
import { getRepoCoverage } from "@/app/actions/supabase/repo-coverage/get-repo-coverage";
import { getTotalCoverage } from "@/app/actions/supabase/total-repo-coverage/get-total-coverage";
import { useAccountContext } from "@/app/components/contexts/Account";
import DocsLink from "@/app/components/DocsLink";
import ErrorBanner from "@/app/components/ErrorBanner";
import InfoIcon from "@/app/components/InfoIcon";
import PeriodSelector, { Period, calculatePeriodDates } from "@/app/components/PeriodSelector";
import ReloadButton from "@/app/components/ReloadButton";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import { RELATIVE_URLS } from "@/config/urls";
import { safeLocalStorage } from "@/lib/local-storage";
import { Tables } from "@/types/supabase";

// Relative imports
import CoverageChart from "./components/CoverageChart";
import CoverageStats from "./components/CoverageStats";
import { generateDummyData } from "./utils/generate-dummy-data";

const DEFAULT_PERIOD: Period = { type: "last-6-months", label: "Last 6 Months" };

export default function ChartsPage() {
  const { currentOwnerId, organizations, currentOwnerName } = useAccountContext();

  const [error, setError] = useState<string | null>(null);
  const [allReposData, setAllReposData] = useState<
    Record<string, { data: Tables<"repo_coverage">[]; isDummy: boolean }>
  >({});
  const [totalCoverageData, setTotalCoverageData] = useState<Tables<"repo_coverage">[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(DEFAULT_PERIOD);
  const [reloadingRepos, setReloadingRepos] = useState<Set<string>>(new Set());

  // Load saved period from localStorage on mount
  useEffect(() => {
    const savedPeriod = safeLocalStorage.getItem("charts-period");
    if (savedPeriod) {
      try {
        const parsed = JSON.parse(savedPeriod);
        setSelectedPeriod(parsed);
      } catch (error) {
        console.error("Failed to parse saved period from localStorage:", error);
      }
    }
  }, []);

  // Save period to localStorage when it changes
  useEffect(() => {
    safeLocalStorage.setItem("charts-period", JSON.stringify(selectedPeriod));
  }, [selectedPeriod]);

  // Fetch data for all repos
  useEffect(() => {
    const fetchData = async () => {
      if (!currentOwnerId) return;

      const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
      if (!currentOrg || currentOrg.repositories.length === 0) return;

      try {
        setError(null);

        const reposData: Record<string, { data: Tables<"repo_coverage">[]; isDummy: boolean }> = {};

        // First pass: fetch all data and group by language
        await Promise.all(
          currentOrg.repositories.map(async (repo) => {
            try {
              const data = await getRepoCoverage(currentOwnerId, repo.repoId);
              // Group data by language
              const dataByLanguage = new Map<string, Tables<"repo_coverage">[]>();
              for (const row of data) {
                const lang = row.language || "Unknown";
                if (!dataByLanguage.has(lang)) dataByLanguage.set(lang, []);
                dataByLanguage.get(lang)!.push(row);
              }
              // Create separate entries for each language
              if (dataByLanguage.size === 0) {
                reposData[repo.repoName] = { data: [], isDummy: false };
              } else if (dataByLanguage.size === 1) {
                // Single language - use repo name only
                const entries = Array.from(dataByLanguage.entries());
                reposData[repo.repoName] = { data: entries[0][1], isDummy: false };
              } else {
                // Multiple languages - use "repoName (language)" format
                Array.from(dataByLanguage.entries()).forEach(([lang, langData]) => {
                  reposData[`${repo.repoName} (${lang})`] = { data: langData, isDummy: false };
                });
              }
            } catch (error) {
              console.error(`Error loading coverage for ${repo.repoName}:`, error);
              reposData[repo.repoName] = { data: [], isDummy: false };
            }
          }),
        );

        // Second pass: check if any repo has real data
        const hasAnyRealData = Object.values(reposData).some(({ data }) => data.length > 0);

        // If no real data exists, show dummy data for all repos
        if (!hasAnyRealData) {
          Object.keys(reposData).forEach((repoName) => {
            reposData[repoName] = { data: generateDummyData(), isDummy: true };
          });
        }

        setAllReposData(reposData);

        // Fetch total coverage from the view
        const totalData = await getTotalCoverage(currentOwnerId);
        // Transform view data to match repo_coverage shape
        const transformedTotalData: Tables<"repo_coverage">[] = totalData
          .filter((row) => row.coverage_date && row.lines_total && row.lines_total > 0)
          .map((row) => ({
            id: 0,
            owner_id: row.owner_id || 0,
            owner_name: currentOwnerName || "",
            repo_id: 0,
            repo_name: "All Repositories",
            branch_name: "all",
            language: "",
            statement_coverage: row.statement_coverage || 0,
            line_coverage: row.statement_coverage || 0,
            function_coverage: row.function_coverage || 0,
            branch_coverage: row.branch_coverage || 0,
            lines_covered: row.lines_covered || 0,
            lines_total: row.lines_total || 0,
            functions_covered: row.functions_covered || 0,
            functions_total: row.functions_total || 0,
            branches_covered: row.branches_covered || 0,
            branches_total: row.branches_total || 0,
            created_at: row.coverage_date || "",
            created_by: "",
          }));
        setTotalCoverageData(transformedTotalData);
      } catch (error) {
        setError("Failed to load coverage history");
        console.error("Error loading coverage history:", error);
      }
    };

    fetchData();
  }, [currentOwnerId, organizations, currentOwnerName]);

  // Filter data based on selected period (client-side)
  const filterDataByPeriod = (data: Tables<"repo_coverage">[]) => {
    const { startDate, endDate } = calculatePeriodDates(selectedPeriod);

    if (!startDate || !endDate) return data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return data.filter((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate >= start && itemDate <= end;
    });
  };

  const handleReloadRepo = async (displayKey: string) => {
    if (!currentOwnerId) return;

    setReloadingRepos((prev) => new Set(prev).add(displayKey));

    try {
      const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
      // Extract base repo name from display key (e.g., "repoName (Python)" -> "repoName")
      const baseRepoName = displayKey.replace(/ \([^)]+\)$/, "");
      const repo = currentOrg?.repositories.find((r) => r.repoName === baseRepoName);

      if (repo) {
        const data = await getRepoCoverage(currentOwnerId, repo.repoId);
        // Group by language
        const dataByLanguage = new Map<string, Tables<"repo_coverage">[]>();
        for (const row of data) {
          const lang = row.language || "Unknown";
          if (!dataByLanguage.has(lang)) dataByLanguage.set(lang, []);
          dataByLanguage.get(lang)!.push(row);
        }

        setAllReposData((prev) => {
          const next = { ...prev };
          // Remove old entries for this repo (both single and multi-language formats)
          for (const key of Object.keys(next)) {
            if (key === baseRepoName || key.startsWith(`${baseRepoName} (`)) {
              delete next[key];
            }
          }
          // Add new entries
          if (dataByLanguage.size === 0) {
            next[baseRepoName] = { data: [], isDummy: false };
          } else if (dataByLanguage.size === 1) {
            const entries = Array.from(dataByLanguage.entries());
            next[baseRepoName] = { data: entries[0][1], isDummy: false };
          } else {
            Array.from(dataByLanguage.entries()).forEach(([lang, langData]) => {
              next[`${baseRepoName} (${lang})`] = { data: langData, isDummy: false };
            });
          }
          return next;
        });
      }
    } catch (error) {
      console.error(`Error reloading coverage for ${displayKey}:`, error);
    } finally {
      setReloadingRepos((prev) => {
        const next = new Set(prev);
        next.delete(displayKey);
        return next;
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col gap-6">
      <div className="w-7/12 md:w-auto flex items-center gap-2">
        <h1 className="text-3xl font-bold">Coverage Charts</h1>
        <DocsLink href={RELATIVE_URLS.DOCS.COVERAGE.CHARTS} />
      </div>

      <ErrorBanner error={error} />
      <RepositorySelector ownerOnly={true} />
      <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

      <div className="space-y-8">
        {totalCoverageData.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mt-2 mb-4 flex items-center gap-2">
              Total Coverage (All Repositories)
              <InfoIcon tooltip="Weighted average across all repositories. Each metric is weighted by its own total (lines for statements, functions for function coverage, branches for branch coverage). Uses forward-fill: each day shows the latest known value for every repo." />
            </h2>
            <div className="space-y-6">
              <CoverageStats data={filterDataByPeriod(totalCoverageData)} />
              <CoverageChart
                data={filterDataByPeriod(totalCoverageData)}
                dateRange={calculatePeriodDates(selectedPeriod)}
              />
            </div>
          </div>
        )}

        {Object.entries(allReposData).map(([repoName, { data, isDummy }]) => {
          const repoFilteredData = filterDataByPeriod(data);

          // If no data and not showing dummy data, show "no data" message
          if (repoFilteredData.length === 0 && !isDummy) {
            return (
              <div key={repoName}>
                <h2 className="text-xl font-semibold mt-2 mb-4 flex items-center gap-2">
                  {repoName}
                  <ReloadButton
                    onClick={() => handleReloadRepo(repoName)}
                    isLoading={reloadingRepos.has(repoName)}
                  />
                </h2>
                <div className="text-center py-8 text-gray-500">
                  <p>No coverage data available for this repository yet.</p>
                </div>
              </div>
            );
          }

          return (
            <div key={repoName}>
              <h2 className="text-xl font-semibold mt-2 mb-4 flex items-center gap-2">
                {repoName}
                <ReloadButton
                  onClick={() => handleReloadRepo(repoName)}
                  isLoading={reloadingRepos.has(repoName)}
                />
              </h2>
              <div className="space-y-6">
                <CoverageStats data={repoFilteredData} isDummyData={isDummy} />
                <CoverageChart
                  data={repoFilteredData}
                  isDummyData={isDummy}
                  dateRange={calculatePeriodDates(selectedPeriod)}
                />
                <div className="text-sm text-gray-500 text-center">
                  {isDummy ? (
                    <p>Showing demo data with {repoFilteredData.length} sample points</p>
                  ) : (
                    <p>Showing {repoFilteredData.length} actual data points</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getRepoCoverage } from "@/app/actions/supabase/coverage/get-repo-coverage";
import { useAccountContext } from "@/app/components/contexts/Account";
import DocsLink from "@/app/components/DocsLink";
import ErrorBanner from "@/app/components/ErrorBanner";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import PeriodSelector, { Period, calculatePeriodDates } from "@/app/components/PeriodSelector";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import { RELATIVE_URLS } from "@/config/urls";
import { Tables } from "@/types/supabase";

// Relative imports
import CoverageChart from "./components/CoverageChart";
import CoverageStats from "./components/CoverageStats";
import { generateDummyData } from "./utils/generate-dummy-data";

const DEFAULT_PERIOD: Period = { type: "last-6-months", label: "Last 6 Months" };

export default function ChartsPage() {
  const { currentOwnerId, currentRepoId, currentRepoName, organizations, currentOwnerName } =
    useAccountContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allRepoCoverageData, setAllRepoCoverageData] = useState<Tables<"repo_coverage">[]>([]);
  const [allReposData, setAllReposData] = useState<
    Record<string, { data: Tables<"repo_coverage">[]; isDummy: boolean }>
  >({});
  const [isDummyData, setIsDummyData] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(DEFAULT_PERIOD);

  // Load saved period from localStorage on mount
  useEffect(() => {
    const savedPeriod = localStorage.getItem("charts-period");
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
    localStorage.setItem("charts-period", JSON.stringify(selectedPeriod));
  }, [selectedPeriod]);

  // Fetch data when repo changes
  useEffect(() => {
    const fetchData = async () => {
      if (!currentOwnerId) {
        setIsLoading(false);
        return;
      }

      const isAllRepos = currentRepoName === "__ALL__";

      // For "All Repositories", we need to fetch data for each repo
      if (isAllRepos) {
        const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
        if (!currentOrg || currentOrg.repositories.length === 0) {
          setIsLoading(false);
          return;
        }

        try {
          setError(null);
          setIsLoading(true);

          const reposData: Record<string, { data: Tables<"repo_coverage">[]; isDummy: boolean }> =
            {};

          await Promise.all(
            currentOrg.repositories.map(async (repo) => {
              try {
                const data = await getRepoCoverage(currentOwnerId, repo.repoId);
                if (data.length === 0) {
                  reposData[repo.repoName] = { data: generateDummyData(), isDummy: true };
                } else {
                  reposData[repo.repoName] = { data, isDummy: false };
                }
              } catch (error) {
                console.error(`Error loading coverage for ${repo.repoName}:`, error);
                reposData[repo.repoName] = { data: generateDummyData(), isDummy: true };
              }
            })
          );

          setAllReposData(reposData);
        } catch (error) {
          setError("Failed to load coverage history");
          console.error("Error loading coverage history:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Single repo mode
        if (!currentRepoId) {
          setIsLoading(false);
          return;
        }

        try {
          setError(null);
          setIsLoading(true);

          const data = await getRepoCoverage(currentOwnerId, currentRepoId);

          if (data.length === 0) {
            setAllRepoCoverageData(generateDummyData());
            setIsDummyData(true);
          } else {
            setAllRepoCoverageData(data);
            setIsDummyData(false);
          }
        } catch (error) {
          setError("Failed to load coverage history");
          console.error("Error loading coverage history:", error);
          setAllRepoCoverageData(generateDummyData());
          setIsDummyData(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [currentOwnerId, currentRepoId, currentRepoName, organizations, currentOwnerName]);

  const isAllRepos = currentRepoName === "__ALL__";

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

  const filteredData = filterDataByPeriod(allRepoCoverageData);

  return (
    <div className="relative min-h-screen flex flex-col gap-6">
      <div className="w-7/12 md:w-auto flex items-center gap-2">
        <h1 className="text-3xl font-bold">Coverage Charts</h1>
        <DocsLink href={RELATIVE_URLS.DOCS.COVERAGE.CHARTS} />
      </div>

      <ErrorBanner error={error} />
      <RepositorySelector />
      <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

      {isLoading && <LoadingSpinner />}

      {!isLoading && isAllRepos && Object.keys(allReposData).length > 0 && (
        <div className="space-y-8">
          {Object.entries(allReposData).map(([repoName, { data, isDummy }]) => {
            const repoFilteredData = filterDataByPeriod(data);
            return (
              <div key={repoName}>
                <h2 className="text-xl font-semibold mt-2 mb-4">{repoName}</h2>
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
      )}

      {!isLoading && !isAllRepos && allRepoCoverageData.length > 0 && (
        <div className="mt-6 space-y-6">
          <CoverageStats data={filteredData} isDummyData={isDummyData} />
          <CoverageChart
            data={filteredData}
            isDummyData={isDummyData}
            dateRange={calculatePeriodDates(selectedPeriod)}
          />

          <div className="text-sm text-gray-500 text-center">
            {isDummyData ? (
              <p>Showing demo data with {filteredData.length} sample points over 3 months</p>
            ) : (
              <p>Showing {filteredData.length} actual data points</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

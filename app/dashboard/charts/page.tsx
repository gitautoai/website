"use client";

import { useEffect, useState } from "react";
import { getRepoCoverage } from "@/app/actions/supabase/get-repo-coverage";
import { useAccountContext } from "@/app/components/contexts/Account";
import DocsLink from "@/app/components/DocsLink";
import ErrorBanner from "@/app/components/ErrorBanner";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import { RELATIVE_URLS } from "@/config/urls";
import { Tables } from "@/types/supabase";

// Relative imports
import { generateDummyData } from "./utils/generate-dummy-data";
import CoverageChart from "./components/CoverageChart";
import CoverageStats from "./components/CoverageStats";

export default function ChartsPage() {
  const { currentOwnerId, currentRepoId } = useAccountContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repoCoverageData, setRepoCoverageData] = useState<Tables<"repo_coverage">[]>([]);
  const [isDummyData, setIsDummyData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentOwnerId || !currentRepoId) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);
        const data = await getRepoCoverage(currentOwnerId, currentRepoId);

        if (data.length === 0) {
          // No real data available, use dummy data
          const dummyData = generateDummyData();
          setRepoCoverageData(dummyData);
          setIsDummyData(true);
        } else {
          setRepoCoverageData(data);
          setIsDummyData(false);
        }
      } catch (error) {
        setError("Failed to load coverage history");
        console.error("Error loading coverage history:", error);

        // On error, also show dummy data
        const dummyData = generateDummyData();
        setRepoCoverageData(dummyData);
        setIsDummyData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentOwnerId, currentRepoId]);

  return (
    <div className="relative min-h-screen">
      <div className="w-7/12 md:w-auto flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Coverage Charts</h1>
        <DocsLink href={RELATIVE_URLS.DOCS.COVERAGE.CHARTS} />
      </div>

      <ErrorBanner error={error} />
      <RepositorySelector />

      {isLoading && <LoadingSpinner />}

      {!isLoading && repoCoverageData.length > 0 && (
        <div className="mt-6 space-y-6">
          <CoverageStats data={repoCoverageData} isDummyData={isDummyData} />
          <CoverageChart data={repoCoverageData} isDummyData={isDummyData} />

          <div className="text-sm text-gray-500 text-center">
            {isDummyData ? (
              <p>Showing demo data with {repoCoverageData.length} sample points over 3 months</p>
            ) : (
              <p>Showing {repoCoverageData.length} actual data points</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

import { getCheckStatusBySHA } from "@/app/actions/github/get-check-status-by-sha";
import { getPRFiles } from "@/app/actions/github/get-pr-files";
import { getOpenPRNumbers, GitAutoPR } from "@/app/actions/github/get-open-pr-numbers";
import { useAccountContext } from "@/app/components/contexts/Account";
import ErrorBanner from "@/app/components/ErrorBanner";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RepositorySelector from "@/app/settings/components/RepositorySelector";

import PRTable from "./components/PRTable";
import { PRData } from "./types";

export default function PRsPage() {
  const { currentOwnerName, currentRepoName, currentInstallationId, organizations } =
    useAccountContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prDataByRepo, setPRDataByRepo] = useState<Record<string, PRData[]>>({});
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const loadFromCache = () => {
      if (!currentOwnerName || !currentRepoName) return;

      try {
        const cacheKey = `pr-data-${currentOwnerName}-${currentRepoName}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setPRDataByRepo(JSON.parse(cached));
        }
      } catch (err) {
        console.error("Failed to load from cache:", err);
      }
    };

    loadFromCache();
  }, [currentOwnerName, currentRepoName]);

  // Fetch fresh data from GitHub
  useEffect(() => {
    const fetchPRData = async () => {
      if (!currentOwnerName || !currentRepoName || !currentInstallationId) {
        setIsLoading(false);
        return;
      }

      const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
      if (!currentOrg || currentOrg.repositories.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        // Determine which repos to fetch
        const reposToFetch =
          currentRepoName === "__ALL__"
            ? currentOrg.repositories.map((r) => r.repoName)
            : [currentRepoName];

        // Fetch PRs for each repo
        const allPRs = await Promise.all(
          reposToFetch.map(async (repoName) => {
            try {
              const prs: GitAutoPR[] = await getOpenPRNumbers({
                ownerName: currentOwnerName,
                repoName,
                installationId: currentInstallationId,
              });

              // Fetch files and check status for each PR
              const prDetailsPromises = prs.map(async (pr) => {
                const results = await Promise.allSettled([
                  getPRFiles({
                    ownerName: currentOwnerName,
                    repoName,
                    installationId: currentInstallationId,
                    prNumber: pr.number,
                  }),
                  getCheckStatusBySHA({
                    ownerName: currentOwnerName,
                    repoName,
                    installationId: currentInstallationId,
                    sha: pr.headSha,
                  }),
                ]);

                const files = results[0].status === "fulfilled" ? results[0].value : [];
                const checkStatus = results[1].status === "fulfilled" ? results[1].value : "none";

                if (results[0].status === "rejected") {
                  console.error(`Failed to fetch files for PR ${pr.number}:`, results[0].reason);
                }
                if (results[1].status === "rejected") {
                  console.error(
                    `Failed to fetch check status for PR ${pr.number}:`,
                    results[1].reason
                  );
                }

                return {
                  number: pr.number,
                  title: pr.title,
                  url: pr.url,
                  headSha: pr.headSha,
                  files,
                  checkStatus,
                  repoName,
                  lastFetched: new Date().toISOString(),
                  hasConflicts: pr.hasConflicts,
                };
              });

              return Promise.all(prDetailsPromises);
            } catch (err) {
              console.error(`Failed to fetch PRs for ${repoName}:`, err);
              return [];
            }
          })
        );

        // Group PRs by repo
        const prsByRepo: Record<string, PRData[]> = {};
        reposToFetch.forEach((repoName, index) => {
          prsByRepo[repoName] = allPRs[index];
        });

        // Update state
        setPRDataByRepo(prsByRepo);

        // Save to localStorage
        const cacheKey = `pr-data-${currentOwnerName}-${currentRepoName}`;
        localStorage.setItem(cacheKey, JSON.stringify(prsByRepo));
      } catch (err) {
        console.error("Failed to fetch PR data:", err);
        setError("Failed to load PR data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPRData();
  }, [currentOwnerName, currentRepoName, currentInstallationId, organizations]);

  // Determine what to display
  const isAllRepos = currentRepoName === "__ALL__";
  const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
  const reposToDisplay = isMounted
    ? isAllRepos
      ? currentOrg?.repositories.map((r) => r.repoName) || []
      : ([currentRepoName].filter(Boolean) as string[])
    : [];

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Open Pull Requests</h1>

      <ErrorBanner error={error} />
      <RepositorySelector />

      <div className="mt-6 space-y-4">
        {reposToDisplay.map((repoName) => {
          const repoPRs = prDataByRepo[repoName] || [];

          return (
            <div key={repoName}>
              {isAllRepos && <h2 className="text-xl font-semibold mb-4">{repoName}</h2>}
              <PRTable prs={repoPRs} />
            </div>
          );
        })}
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}

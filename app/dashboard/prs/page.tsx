"use client";

import { useEffect, useState } from "react";

import { slackUs } from "@/app/actions/slack/slack-us";
import { getCheckStatusBySHA } from "@/app/actions/github/get-check-status-by-sha";
import { getPRFiles } from "@/app/actions/github/get-pr-files";
import { getOpenPRNumbers, GitAutoPR } from "@/app/actions/github/get-open-pr-numbers";
import { useAccountContext } from "@/app/components/contexts/Account";
import ErrorBanner from "@/app/components/ErrorBanner";
import FilterSelect from "@/app/components/FilterSelect";
import ReloadButton from "@/app/components/ReloadButton";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import { safeLocalStorage } from "@/lib/local-storage";

import PRTable from "./components/PRTable";
import { PRData } from "./types";

export default function PRsPage() {
  const { userId, userName, currentOwnerName, currentInstallationId, organizations } =
    useAccountContext();

  const [error, setError] = useState<string | null>(null);
  const [prDataByRepo, setPRDataByRepo] = useState<Record<string, PRData[]>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [reloadingRepos, setReloadingRepos] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"all" | "failed-or-conflicts">("all");

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Send Slack notification on page visit
  useEffect(() => {
    if (!userId || !userName || !currentOwnerName) return;

    const message = `${userName} (${userId}) visited PRs page for ${currentOwnerName}`;
    slackUs(message);
  }, [userId, userName, currentOwnerName]);

  // Load saved filter from localStorage on mount
  useEffect(() => {
    setStatusFilter((safeLocalStorage.getItem("pr-status-filter") as typeof statusFilter) || "all");
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (!currentOwnerName) return;

    try {
      const cacheKey = `pr-data-${currentOwnerName}`;
      const cached = safeLocalStorage.getItem(cacheKey);
      if (cached) {
        setPRDataByRepo(JSON.parse(cached));
      }
    } catch (err) {
      console.error("Failed to load from cache:", err);
    }
  }, [currentOwnerName]);

  // Fetch PRs for a single repo
  const fetchRepoPRs = async (repoName: string): Promise<PRData[]> => {
    if (!currentOwnerName || !currentInstallationId) return [];

    const prs: GitAutoPR[] = await getOpenPRNumbers({
      ownerName: currentOwnerName,
      repoName,
      installationId: currentInstallationId,
    });

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
        console.error(`Failed to fetch check status for PR ${pr.number}:`, results[1].reason);
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
        createdAt: pr.createdAt,
      };
    });

    return Promise.all(prDetailsPromises);
  };

  // Fetch fresh data from GitHub for all repos
  useEffect(() => {
    const fetchPRData = async () => {
      if (!currentOwnerName || !currentInstallationId) return;

      const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
      if (!currentOrg || currentOrg.repositories.length === 0) return;

      try {
        setError(null);

        const reposToFetch = currentOrg.repositories.map((r) => r.repoName);

        // Mark all repos as loading
        setReloadingRepos(new Set(reposToFetch));

        const allPRsResults = await Promise.allSettled(
          reposToFetch.map((repoName) => fetchRepoPRs(repoName)),
        );

        // Group PRs by repo
        const prsByRepo: Record<string, PRData[]> = {};
        reposToFetch.forEach((repoName, index) => {
          const result = allPRsResults[index];
          if (result.status === "fulfilled") {
            prsByRepo[repoName] = result.value;
          } else {
            console.error(`Failed to fetch PRs for ${repoName}:`, result.reason);
            prsByRepo[repoName] = [];
          }
        });

        // Update state
        setPRDataByRepo(prsByRepo);

        // Save to localStorage
        const cacheKey = `pr-data-${currentOwnerName}`;
        safeLocalStorage.setItem(cacheKey, JSON.stringify(prsByRepo));
      } catch (err) {
        console.error("Failed to fetch PR data:", err);
        setError("Failed to load PR data. Please try again.");
      } finally {
        setReloadingRepos(new Set());
      }
    };

    fetchPRData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchRepoPRs excluded to prevent infinite re-renders
  }, [currentOwnerName, currentInstallationId, organizations]);

  const handleReloadRepo = async (repoName: string) => {
    setReloadingRepos((prev) => new Set(prev).add(repoName));

    // Send Slack notification
    if (userId && userName && currentOwnerName) {
      const message = `${userName} (${userId}) reloaded ${currentOwnerName}/${repoName} on PRs page`;
      slackUs(message);
    }

    try {
      const prData = await fetchRepoPRs(repoName);
      setPRDataByRepo((prev) => ({ ...prev, [repoName]: prData }));
    } catch (error) {
      console.error(`Error reloading repo ${repoName}:`, error);
    } finally {
      setReloadingRepos((prev) => {
        const next = new Set(prev);
        next.delete(repoName);
        return next;
      });
    }
  };

  const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
  const reposToDisplay = isMounted ? currentOrg?.repositories.map((r) => r.repoName) || [] : [];

  const handleStatusFilterChange = (value: string) => {
    const filterValue = value as typeof statusFilter;
    setStatusFilter(filterValue);
    safeLocalStorage.setItem("pr-status-filter", filterValue);
  };

  const filterPRs = (prs: PRData[]) => {
    if (statusFilter === "all") return prs;
    return prs.filter((pr) => pr.checkStatus !== "success" || pr.hasConflicts);
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Open Pull Requests</h1>

      <ErrorBanner error={error} />
      <RepositorySelector ownerOnly={true} />

      <div className="mt-6 mb-4">
        <FilterSelect
          label="Status Filter"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={[
            { value: "all", label: "All PRs" },
            { value: "failed-or-conflicts", label: "Failed or Conflicts" },
          ]}
        />
      </div>

      <div className="space-y-4">
        {reposToDisplay.map((repoName) => {
          const repoPRs = prDataByRepo[repoName] || [];
          const filteredPRs = filterPRs(repoPRs);

          return (
            <div key={repoName}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {repoName}
                <ReloadButton
                  onClick={() => handleReloadRepo(repoName)}
                  isLoading={reloadingRepos.has(repoName)}
                />
              </h2>
              <PRTable prs={filteredPRs} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

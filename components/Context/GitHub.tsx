"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAccountContext } from "./Account";
import useSWR from "swr";

interface Repository {
  repoId: number;
  repoName: string;
}

interface Organization {
  ownerId: number;
  ownerName: string;
  ownerType: "User" | "Organization";
  repositories: Repository[];
}

interface GitHubContextType {
  organizations: Organization[];
  currentOwnerId: number | null;
  currentOwnerName: string | null;
  currentRepoId: number | null;
  currentRepoName: string | null;
  currentInstallationId: number | null;
  isLoading: boolean;
  error: string | null;
  setCurrentOwnerName: (ownerName: string | null) => void;
  setCurrentRepoName: (repoName: string | null) => void;
  refreshData: () => Promise<void>;
  loadSettings: (ownerName: string, repoName: string) => Promise<any>;
  saveSettings: (
    ownerName: string,
    repoName: string,
    settings: any,
    settingsType: "rules" | "screenshot" | "reference"
  ) => Promise<any>;
}

const GitHubContext = createContext<GitHubContextType>({
  organizations: [],
  currentOwnerId: null,
  currentOwnerName: null,
  currentRepoId: null,
  currentRepoName: null,
  currentInstallationId: null,
  isLoading: true,
  error: null,
  setCurrentOwnerName: () => {},
  setCurrentRepoName: () => {},
  refreshData: async () => {},
  loadSettings: async () => {},
  saveSettings: async () => {},
});

export function GitHubProvider({ children }: { children: React.ReactNode }) {
  const { installationIds, jwtToken, userId } = useAccountContext();
  const [currentOwnerName, setCurrentOwnerName] = useState<string | null>(null);
  const [currentRepoName, setCurrentRepoName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const swrOptions = {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
    suspense: false,
    keepPreviousData: true,
  };

  const fetchOrganizations = async (installationIds: number[]) => {
    const startTime = performance.now();
    console.log("Starting GitHub API request...");

    try {
      const response = await fetch("/api/github/get-installed-repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ installationIds }),
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch organizations");
      }

      const data = await response.json();
      const endTime = performance.now();
      console.log(`fetchOrganizations execution time: ${endTime - startTime}ms`);
      return data;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      throw error;
    }
  };

  const { data: organizations, mutate: mutateOrganizations } = useSWR<Organization[]>(
    installationIds.length > 0 ? ["github-organizations", installationIds.join(",")] : null,
    () => fetchOrganizations(installationIds),
    {
      ...swrOptions,
      revalidateIfStale: false,
      revalidateOnMount: true,
      dedupingInterval: 600000,
    }
  );

  const currentOwnerId = currentOwnerName
    ? organizations?.find((org) => org.ownerName === currentOwnerName)?.ownerId || null
    : null;

  const currentRepoId =
    currentRepoName && currentOwnerName
      ? organizations
          ?.find((org) => org.ownerName === currentOwnerName)
          ?.repositories.find((repo) => repo.repoName === currentRepoName)?.repoId || null
      : null;

  const currentInstallationId = currentOwnerName
    ? installationIds.find((index) => organizations?.[index]?.ownerName === currentOwnerName) ||
      null
    : null;

  const loadSettings = async (ownerName: string, repoName: string) => {
    const startTime = performance.now();

    try {
      const org = organizations?.find((o) => o.ownerName === ownerName);
      const repo = org?.repositories.find((r) => r.repoName === repoName);

      if (!org || !repo) {
        console.error("Organization or repository not found");
        return null;
      }

      const url = `/api/supabase/get-repository-settings?ownerId=${org.ownerId}&repoId=${repo.repoId}`;
      const response = await fetch(url, {
        priority: "high",
        cache: "no-store",
        next: { revalidate: 0 },
      });

      if (!response.ok) throw new Error("Failed to fetch repository settings");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading settings:", error);
      return null;
    } finally {
      const endTime = performance.now();
      console.log(`loadSettings execution time: ${endTime - startTime}ms`);
    }
  };

  const saveSettings = async (
    ownerName: string,
    repoName: string,
    settingsData: any,
    settingsType: "rules" | "screenshot" | "reference"
  ) => {
    const startTime = performance.now();
    try {
      const org = organizations?.find((o) => o.ownerName === ownerName);
      const repo = org?.repositories.find((r) => r.repoName === repoName);

      if (!org || !repo) {
        console.error("Organization or repository not found");
        return null;
      }

      const response = await fetch("/api/supabase/save-repository-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwtToken}` },
        body: JSON.stringify({
          ownerId: org.ownerId,
          repoId: repo.repoId,
          repoName: repoName,
          userId,
          settingsType,
          ...settingsData,
        }),
      });

      if (!response.ok) throw new Error(`Failed to save ${settingsType} settings`);
      return await response.json();
    } catch (err) {
      console.error(`Error saving ${settingsType} settings:`, err);
      return null;
    } finally {
      const endTime = performance.now();
      console.log(`saveSettings (${settingsType}) execution time: ${endTime - startTime}ms`);
    }
  };

  const handleOwnerSelection = (ownerName: string | null) => {
    setCurrentOwnerName(ownerName);

    if (ownerName) {
      const org = organizations?.find((o) => o.ownerName === ownerName);
      if (org && org.repositories.length > 0) {
        setCurrentRepoName(org.repositories[0].repoName);
      } else {
        setCurrentRepoName(null);
      }
    } else {
      setCurrentRepoName(null);
    }
  };

  const handleRepoSelection = (repoName: string | null) => {
    setCurrentRepoName(repoName);

    if (repoName && !currentOwnerName) {
      for (const org of organizations || []) {
        const repo = org.repositories.find((r) => r.repoName === repoName);
        if (repo) {
          setCurrentOwnerName(org.ownerName);
          break;
        }
      }
    }
  };

  useEffect(() => {
    if (!organizations) return;

    const savedRepo = localStorage.getItem("currentRepo");
    const savedOwner = localStorage.getItem("currentOwner");

    if (savedRepo && savedOwner) {
      const orgExists = organizations.some((org) => org.ownerName === savedOwner);
      const repoExists = organizations.some((org) =>
        org.repositories.some((repo) => repo.repoName === savedRepo)
      );

      if (orgExists && repoExists) {
        setCurrentOwnerName(savedOwner);
        setCurrentRepoName(savedRepo);
        return;
      }
    }

    if (organizations.length > 0 && organizations[0].repositories.length > 0) {
      setCurrentOwnerName(organizations[0].ownerName);
      setCurrentRepoName(organizations[0].repositories[0].repoName);
    }
  }, [organizations]);

  return (
    <GitHubContext.Provider
      value={{
        organizations: organizations || [],
        currentOwnerId,
        currentOwnerName,
        currentRepoId,
        currentRepoName,
        currentInstallationId,
        isLoading: !error && !organizations,
        error,
        setCurrentOwnerName: handleOwnerSelection,
        setCurrentRepoName: handleRepoSelection,
        refreshData: async () => {
          await mutateOrganizations();
          return;
        },
        loadSettings,
        saveSettings,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  return useContext(GitHubContext);
}

"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { isTokenExpired } from "@/utils/auth";
import { fetchWithTiming } from "@/utils/fetch";
import { swrOptions, extendedSwrOptions } from "@/config/swr";
import { RELATIVE_URLS } from "@/config/index";
import { STORAGE_KEYS } from "@/lib/constants";
import { Installation, Organization, SettingsType } from "@/types/github";
import { AccountContextType } from "@/types/account";

const AccountContext = createContext<AccountContextType>({
  installations: undefined,
  mutateInstallations: () => {},
  installationsSubscribed: null,
  selectedIndex: null,
  setSelectedIndex: () => {},
  userId: null,
  userName: null,
  email: null,
  installationIds: [],
  jwtToken: null,
  organizations: [],
  currentOwnerId: null,
  currentOwnerName: null,
  currentRepoId: null,
  currentRepoName: null,
  currentInstallationId: null,
  isLoading: true,
  setCurrentOwnerName: () => {},
  setCurrentRepoName: () => {},
  refreshData: async () => {},
  loadSettings: async () => {},
  saveSettings: async () => {},
});

export function AccountContextWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [installationIds, setInstallationIds] = useState<number[]>([]);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [currentOwnerName, setCurrentOwnerName] = useState<string | null>(null);
  const [currentRepoName, setCurrentRepoName] = useState<string | null>(null);
  const router = useRouter();

  // Process session information
  useEffect(() => {
    if (!session) return;
    setUserId(session.user.userId);
    setUserName(session.user.name || "Unknown User Name");
    setEmail(session.user.email || "Unknown Email");
    if (isTokenExpired(session.jwtToken)) {
      signOut({ callbackUrl: "/" });
      return;
    }
    setJwtToken(session.jwtToken);
    setAccessToken(session.accessToken);
  }, [
    session?.jwtToken,
    session?.user.email,
    session?.user.name,
    session?.user.userId,
    session?.accessToken,
  ]);

  // Fetch installation information
  const fetchInstallations = async () => {
    if (!userId || !accessToken) return [];

    return fetchWithTiming("/api/users/get-user-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, accessToken }),
      cache: "no-store",
    });
  };

  const { data: installations, mutate: mutateInstallations } = useSWR<Installation[]>(
    userId ? `fetchInstallations-${userId}` : null,
    fetchInstallations,
    swrOptions
  );

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    if (!userId || !jwtToken || !installations) return null;

    const customerIds = installations.map(
      (installation: Installation) => installation.stripe_customer_id
    );

    return fetchWithTiming("/api/stripe/get-userinfo-subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, jwtToken, customerIds }),
      cache: "no-store",
    });
  };

  const { data: installationsSubscribed } = useSWR(
    userId ? `fetchSubscriptionStatus-${userId}` : null,
    fetchSubscriptionStatus,
    swrOptions
  );

  // Handle installation selection
  useEffect(() => {
    if (!installations) return;

    const currentOwnerName = localStorage.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME);

    if (currentOwnerName) {
      const newIndex = installations.findIndex(
        (installation: Installation) => installation.owner_name === currentOwnerName
      );

      if (newIndex !== -1) {
        setSelectedIndex(newIndex);
      } else if (installations.length > 0) {
        setSelectedIndex(0);
        localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, installations[0].owner_name);
      }
    } else if (installations.length > 0) {
      setSelectedIndex(0);
      localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, installations[0].owner_name);
    }
  }, [installations]);

  // Update installation IDs
  useEffect(() => {
    if (!installations) return;
    const newInstallationIds = installations.map((installation: Installation) =>
      Number(installation.installation_id)
    );

    if (JSON.stringify(newInstallationIds) !== JSON.stringify(installationIds))
      setInstallationIds(newInstallationIds);
  }, [installations]);

  // Redirect if no installations
  useEffect(() => {
    if (installations && installations.length === 0) router.push(RELATIVE_URLS.REDIRECT_TO_INSTALL);
  }, [installations, router]);

  // Fetch organizations
  const fetchOrganizations = async (installationIds: number[]) => {
    return fetchWithTiming("/api/github/get-installed-repos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installationIds }),
      next: { revalidate: 300 },
    });
  };

  const { data: organizations, mutate: mutateOrganizations } = useSWR<Organization[]>(
    installationIds.length > 0 ? ["github-organizations", installationIds.join(",")] : null,
    () => fetchOrganizations(installationIds),
    extendedSwrOptions
  );

  // Calculate current selection information
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

  // Load settings
  const loadSettings = async (ownerName: string, repoName: string) => {
    const org = organizations?.find((o) => o.ownerName === ownerName);
    const repo = org?.repositories.find((r) => r.repoName === repoName);

    if (!org || !repo) {
      console.error("Organization or repository not found");
      return null;
    }

    const url = `/api/supabase/get-repository-settings?ownerId=${org.ownerId}&repoId=${repo.repoId}`;
    return fetchWithTiming(url, {
      priority: "high",
      cache: "no-store",
      next: { revalidate: 0 },
    });
  };

  // Save settings
  const saveSettings = async (
    ownerName: string,
    repoName: string,
    settingsData: any,
    settingsType: SettingsType
  ) => {
    const org = organizations?.find((o) => o.ownerName === ownerName);
    const repo = org?.repositories.find((r) => r.repoName === repoName);

    if (!org || !repo) {
      console.error("Organization or repository not found");
      return null;
    }

    return fetchWithTiming("/api/supabase/save-repository-settings", {
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
  };

  // Handle owner selection
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

  // Handle repository selection
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

  // Save current owner & repo selection to localStorage
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
    <AccountContext.Provider
      value={{
        installations,
        mutateInstallations,
        installationsSubscribed,
        selectedIndex,
        setSelectedIndex,
        userId,
        userName,
        email,
        installationIds,
        jwtToken,
        organizations: organizations || [],
        currentOwnerId,
        currentOwnerName,
        currentRepoId,
        currentRepoName,
        currentInstallationId,
        isLoading: !organizations,
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
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContext);
}

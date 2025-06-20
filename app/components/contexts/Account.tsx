"use client";

// Third party imports
import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";

// Local imports
import { swrOptions, extendedSwrOptions } from "@/config/swr";
import { STORAGE_KEYS } from "@/lib/constants";
import { AccountContextType } from "@/types/account";
import { Installation, Organization } from "@/types/github";
import { fetchWithTiming } from "@/utils/fetch";

const AccountContext = createContext<AccountContextType>({
  installations: undefined,
  mutateInstallations: () => {},
  installationsSubscribed: null,
  selectedIndex: undefined,
  setSelectedIndex: () => {},
  userId: null,
  userName: "Unknown User",
  email: null,
  installationIds: [],
  jwtToken: null,
  accessToken: undefined,
  organizations: [],
  currentOwnerId: null,
  currentOwnerType: null,
  currentOwnerName: null,
  currentRepoId: null,
  currentRepoName: null,
  currentInstallationId: null,
  currentStripeCustomerId: null,
  billingPeriod: "Monthly",
  isLoading: true,
  refreshData: async () => {},
  setBillingPeriod: () => {},
  setCurrentOwnerName: () => {},
  setCurrentRepoName: () => {},
});

export function AccountContextWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("Unknown User");
  const [email, setEmail] = useState<string | null>(null);
  const [installationIds, setInstallationIds] = useState<number[]>([]);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [currentOwnerId, setCurrentOwnerId] = useState<number | null>(null);
  const [currentOwnerType, setCurrentOwnerType] = useState<"User" | "Organization" | null>(null);
  const [currentOwnerName, setCurrentOwnerName] = useState<string | null>(null);
  const [currentRepoId, setCurrentRepoId] = useState<number | null>(null);
  const [currentRepoName, setCurrentRepoName] = useState<string | null>(null);
  const [currentInstallationId, setCurrentInstallationId] = useState<number | null>(null);
  const [currentStripeCustomerId, setCurrentStripeCustomerId] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"Monthly" | "Yearly">("Monthly");

  // Process session information
  useEffect(() => {
    if (!session) return;
    setUserId(session.user.userId);
    setUserName(session.user.name || "Unknown User");
    setEmail(session.user.email || "Unknown Email");
    setJwtToken(session.jwtToken);
    setAccessToken(session.accessToken);
  }, [session]);

  // Fetch installation information
  const fetchInstallations = async () => {
    if (!userId || !accessToken) return undefined;

    return fetchWithTiming<Installation[]>("/api/users/get-user-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, accessToken }),
      cache: "no-store",
    });
  };

  const { data: installations, mutate: mutateInstallations } = useSWR<Installation[] | undefined>(
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

    return fetchWithTiming<boolean[]>("/api/stripe/get-userinfo-subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, jwtToken, customerIds }),
      cache: "no-store",
    });
  };

  const { data: installationsSubscribed = null } = useSWR(
    userId && installations ? [`fetchSubscriptionStatus-${userId}`, installations] : null,
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

    setInstallationIds((prevIds) => {
      if (JSON.stringify(newInstallationIds) !== JSON.stringify(prevIds)) return newInstallationIds;
      return prevIds;
    });
  }, [installations]);

  // Fetch organizations
  const fetchOrganizations = async (installationIds: number[]) => {
    return fetchWithTiming<Organization[]>("/api/github/get-installed-repos", {
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

  // Add useEffect to update the values when dependencies change
  useEffect(() => {
    if (!organizations || !currentOwnerName) {
      setCurrentOwnerId(null);
      setCurrentOwnerType(null);
      return;
    }

    const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
    if (currentOrg) {
      setCurrentOwnerId(currentOrg.ownerId);
      setCurrentOwnerType(currentOrg.ownerType);
    }
  }, [organizations, currentOwnerName]);

  useEffect(() => {
    if (!organizations || !currentOwnerName || !currentRepoName) {
      setCurrentRepoId(null);
      return;
    }

    const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
    const currentRepo = currentOrg?.repositories.find((repo) => repo.repoName === currentRepoName);
    if (currentRepo) setCurrentRepoId(currentRepo.repoId);
  }, [organizations, currentOwnerName, currentRepoName]);

  useEffect(() => {
    if (!installations || !currentOwnerName) {
      setCurrentInstallationId(null);
      setCurrentStripeCustomerId(null);
      return;
    }

    const currentInstallation = installations.find(
      (installation) => installation.owner_name === currentOwnerName
    );

    if (currentInstallation) {
      setCurrentInstallationId(Number(currentInstallation.installation_id));
      setCurrentStripeCustomerId(currentInstallation.stripe_customer_id || null);
    }
  }, [installations, currentOwnerName]);

  // Handle owner selection
  const handleOwnerSelection = (ownerName: string | null) => {
    setCurrentOwnerName(ownerName);

    if (ownerName) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, ownerName);

      const org = organizations?.find((o) => o.ownerName === ownerName);
      if (org && org.repositories.length > 0) {
        const repoName = org.repositories[0].repoName;
        setCurrentRepoName(repoName);
        localStorage.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, repoName);
      } else {
        setCurrentRepoName(null);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_REPO_NAME);
      }
    } else {
      setCurrentRepoName(null);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_OWNER_NAME);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_REPO_NAME);
    }
  };

  // Handle repository selection
  const handleRepoSelection = (repoName: string | null) => {
    setCurrentRepoName(repoName);

    if (repoName) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, repoName);

      if (!currentOwnerName) {
        for (const org of organizations || []) {
          const repo = org.repositories.find((r) => r.repoName === repoName);
          if (repo) {
            setCurrentOwnerName(org.ownerName);
            localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, org.ownerName);
            break;
          }
        }
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_REPO_NAME);
    }
  };

  // Save current owner & repo selection to localStorage
  useEffect(() => {
    if (!organizations) return;

    const savedRepo = localStorage.getItem(STORAGE_KEYS.CURRENT_REPO_NAME);
    const savedOwner = localStorage.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME);

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
        accessToken,
        organizations: organizations || [],
        currentOwnerId,
        currentOwnerType,
        currentOwnerName,
        currentRepoId,
        currentRepoName,
        currentInstallationId,
        currentStripeCustomerId,
        billingPeriod,
        isLoading: !organizations,
        refreshData: async () => {
          await mutateOrganizations();
          return;
        },
        setBillingPeriod,
        setCurrentOwnerName: handleOwnerSelection,
        setCurrentRepoName: handleRepoSelection,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContext);
}

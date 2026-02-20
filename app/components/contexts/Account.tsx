"use client";

// Third party imports
import { useSession, signOut } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";

// Local imports
import { getOwnerIds } from "@/app/actions/github/get-owner-ids";
import { getInstallationsByOwnerIds } from "@/app/actions/supabase/installations/get-installations-by-owner-ids";
import { getOwners } from "@/app/actions/supabase/owners/get-owners";
import { checkActiveSubscription } from "@/app/actions/stripe/check-active-subscription";
import { getInstalledRepos } from "@/app/actions/github/get-installed-repos";
import { swrOptions } from "@/config/swr";
import { STORAGE_KEYS } from "@/lib/constants";
import { safeLocalStorage } from "@/lib/local-storage";
import { AccountContextType } from "@/types/account";
import { Installation, Organization } from "@/types/github";
import { parseName } from "@/utils/parse-name";

const AccountContext = createContext<AccountContextType>({
  installations: undefined,
  mutateInstallations: () => {},
  userId: null,
  userLogin: null,
  userName: "Unknown User",
  firstName: "",
  lastName: "",
  email: null,
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
  isLoading: true,
  refreshData: async () => {},
  setCurrentOwnerName: () => {},
  setCurrentRepoName: () => {},
});

export function AccountContextWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  // User information
  const [userId, setUserId] = useState<number | null>(null);
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Unknown User");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  // Owner information
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Current selection
  const [currentOwnerId, setCurrentOwnerId] = useState<number | null>(null);
  const [currentOwnerType, setCurrentOwnerType] = useState<"User" | "Organization" | null>(null);
  const [currentOwnerName, setCurrentOwnerName] = useState<string | null>(() =>
    safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME),
  );
  const [currentRepoId, setCurrentRepoId] = useState<number | null>(null);
  const [currentRepoName, setCurrentRepoName] = useState<string | null>(() =>
    safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_REPO_NAME),
  );
  const [currentInstallationId, setCurrentInstallationId] = useState<number | null>(() => {
    const cached = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_INSTALLATION_ID);
    return cached ? parseInt(cached, 10) : null;
  });
  const [currentStripeCustomerId, setCurrentStripeCustomerId] = useState<string | null>(() =>
    safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_STRIPE_CUSTOMER_ID),
  );

  // Load cached organizations on mount (before API call completes)
  useEffect(() => {
    const cached = safeLocalStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
    if (cached) {
      try {
        setOrganizations(JSON.parse(cached));
      } catch (error) {
        console.error("Failed to parse cached organizations:", error);
      }
    }
  }, []);

  // Process session information
  useEffect(() => {
    if (!session) return;

    // Force sign out if login is missing
    if (session.user.userId && !session.user.login) {
      signOut();
      return;
    }

    setUserId(session.user.userId);
    setUserLogin(session.user.login || null);
    const fullName = session.user.name || "Unknown User";
    setUserName(fullName);
    const { firstName, lastName } = parseName(fullName);
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(session.user.email || "Unknown Email");
    setJwtToken(session.jwtToken);
    setAccessToken(session.accessToken);
  }, [session]);

  // Fetch installation information with subscription status
  const fetchInstallations = async () => {
    if (!userId || !accessToken || !jwtToken) return undefined;

    // Get owner IDs from GitHub
    const ownerIds = await getOwnerIds(userId, accessToken);

    // Get installations, owners, and organizations data
    const [installations, owners] = await Promise.all([
      getInstallationsByOwnerIds(ownerIds),
      getOwners(ownerIds),
    ]);

    // Get organizations data
    const organizations = await getInstalledRepos(installations);

    // Combine installations with owner data
    const installationsWithOwners = await Promise.all(
      installations.map(async (installation) => {
        const owner = owners.find((o) => o.owner_id === installation.owner_id);
        const stripeCustomerId = owner?.stripe_customer_id || "";
        const hasActiveSubscription = stripeCustomerId
          ? await checkActiveSubscription(stripeCustomerId)
          : false;

        return {
          id: installation.installation_id.toString(),
          installation_id: installation.installation_id,
          owner_id: installation.owner_id,
          owner_type: installation.owner_type as "User" | "Organization",
          owner_name: installation.owner_name,
          user_id: installation.owner_id,
          user_name: installation.owner_name,
          stripe_customer_id: stripeCustomerId,
          hasActiveSubscription,
        };
      }),
    );

    // Update all states while we're at it
    setOrganizations(organizations);
    safeLocalStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(organizations));

    // Handle installation selection and set current values
    const savedOwnerName = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME);

    let selectedOwnerName = savedOwnerName;

    if (savedOwnerName) {
      const ownerExists = installationsWithOwners.some(
        (installation) => installation.owner_name === savedOwnerName,
      );

      if (!ownerExists && installationsWithOwners.length > 0) {
        // Saved owner doesn't exist, use first installation
        selectedOwnerName = installationsWithOwners[0].owner_name;
        safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, selectedOwnerName);
      }
    } else if (installationsWithOwners.length > 0) {
      // No saved owner, use first installation
      selectedOwnerName = installationsWithOwners[0].owner_name;
      safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, selectedOwnerName);
    }

    // Set current owner name and ID for initial load
    if (selectedOwnerName) {
      setCurrentOwnerName(selectedOwnerName);

      // For initial load, also set the ID directly from installations
      const selectedInstallation = installationsWithOwners.find(
        (installation) => installation.owner_name === selectedOwnerName,
      );
      if (selectedInstallation) {
        setCurrentOwnerId(selectedInstallation.owner_id);
        setCurrentOwnerType(selectedInstallation.owner_type);

        // Set initial repo selection if organizations are available
        const selectedOrg = organizations.find((org) => org.ownerName === selectedOwnerName);
        if (selectedOrg) {
          const savedRepo = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_REPO_NAME);
          if (
            savedRepo &&
            (savedRepo === "__ALL__" ||
              selectedOrg.repositories.some((repo) => repo.repoName === savedRepo))
          ) {
            setCurrentRepoName(savedRepo);
            if (savedRepo !== "__ALL__") {
              const currentRepo = selectedOrg.repositories.find(
                (repo) => repo.repoName === savedRepo,
              );
              if (currentRepo) setCurrentRepoId(currentRepo.repoId);
            }
          } else if (selectedOrg.repositories.length > 0) {
            const firstRepo = selectedOrg.repositories[0];
            setCurrentRepoName(firstRepo.repoName);
            setCurrentRepoId(firstRepo.repoId);
            safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, firstRepo.repoName);
          }
        }

        setCurrentInstallationId(selectedInstallation.installation_id);
        setCurrentStripeCustomerId(selectedInstallation.stripe_customer_id);
        safeLocalStorage.setItem(
          STORAGE_KEYS.CURRENT_INSTALLATION_ID,
          selectedInstallation.installation_id.toString(),
        );
        safeLocalStorage.setItem(
          STORAGE_KEYS.CURRENT_STRIPE_CUSTOMER_ID,
          selectedInstallation.stripe_customer_id,
        );
      }
    }

    return installationsWithOwners;
  };

  const { data: installations, mutate: mutateInstallations } = useSWR<Installation[] | undefined>(
    userId ? `fetchInstallations-${userId}` : null,
    fetchInstallations,
    swrOptions,
  );

  // Auto-update owner-related states when currentOwnerName changes
  useEffect(() => {
    if (!currentOwnerName || !organizations) return;

    const org = organizations.find((o) => o.ownerName === currentOwnerName);
    if (org) {
      setCurrentOwnerId(org.ownerId);
      setCurrentOwnerType(org.ownerType);

      // Also update installation ID
      const installation = installations?.find((inst) => inst.owner_name === currentOwnerName);
      if (installation) {
        setCurrentInstallationId(installation.installation_id);
        setCurrentStripeCustomerId(installation.stripe_customer_id);
        safeLocalStorage.setItem(
          STORAGE_KEYS.CURRENT_INSTALLATION_ID,
          installation.installation_id.toString(),
        );
        safeLocalStorage.setItem(
          STORAGE_KEYS.CURRENT_STRIPE_CUSTOMER_ID,
          installation.stripe_customer_id,
        );
      }
    }
  }, [currentOwnerName, organizations, installations]);

  // Auto-update repo-related states when currentRepoName changes
  useEffect(() => {
    if (!currentRepoName || !organizations) return;

    for (const org of organizations) {
      const repo = org.repositories.find((r) => r.repoName === currentRepoName);
      if (repo) {
        setCurrentRepoId(repo.repoId);
        break;
      }
    }
  }, [currentRepoName, organizations]);

  // Handle owner selection
  const handleOwnerSelection = (ownerName: string | null) => {
    setCurrentOwnerName(ownerName);

    if (ownerName) {
      safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, ownerName);
    } else {
      safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_OWNER_NAME);
      safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_REPO_NAME);
      safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_INSTALLATION_ID);
      safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_STRIPE_CUSTOMER_ID);
    }
  };

  // Handle repository selection
  const handleRepoSelection = (repoName: string | null) => {
    setCurrentRepoName(repoName);

    if (repoName) {
      safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, repoName);
    } else {
      safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_REPO_NAME);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        installations,
        mutateInstallations,
        userId,
        userLogin,
        userName,
        firstName,
        lastName,
        email,
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
        isLoading: !organizations,
        refreshData: async () => {
          await mutateInstallations();
          return;
        },
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

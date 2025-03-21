"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { isTokenExpired } from "@/utils/auth";
import { RELATIVE_URLS } from "@/config/index";
import { STORAGE_KEYS } from "@/lib/constants";

export interface Installation {
  id: string;
  installation_id: string;
  owner_id: string;
  owner_type: "User" | "Organization";
  owner_name: string;
  user_id: string;
  user_name: string;
  stripe_customer_id: string;
}

const AccountContext = createContext<{
  installations: Installation[] | undefined;
  mutateInstallations: () => void;
  installationsSubscribed: boolean[] | null; // whether a given installation has a live subscription or not
  selectedIndex: number | null; // Index of selected account
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  userId: number | null;
  userName: string | null;
  email: string | null;
  installationIds: number[];
  jwtToken: string | null;
}>({
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
  const router = useRouter();

  // Get userId and jwtToken from session object
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    session?.jwtToken,
    session?.user.email,
    session?.user.name,
    session?.user.userId,
    session?.accessToken,
  ]);

  let getInstallationsUrl = "";
  let getInstallationsSubscribed = "";
  if (userId) getInstallationsUrl = `/api/users/get-user-info?userId=${userId}`;

  // Common SWR options
  const swrOptions = {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
    suspense: false,
    keepPreviousData: true,
  };

  // Common fetch function
  const fetchWithCache = async (url: string, logLabel: string) => {
    const res = await fetch(url, {
      next: { revalidate: 300 }, // Tell Next.js to cache the response for 300 seconds
      cache: "force-cache", // Tell fetch to use the browser's HTTP cache
    });

    if (!res.ok) throw new Error(`Failed to fetch ${logLabel}`);

    return await res.json();
  };

  const { data: installations, mutate: mutateInstallations } = useSWR<Installation[]>(
    getInstallationsUrl,
    () => fetchWithCache(getInstallationsUrl, "installations"),
    swrOptions
  );

  // Get installations that have a live subscription
  if (installations) {
    console.log("installations: ", installations);
    const customerIds: string[] = installations.map(
      (installation: Installation) => installation.stripe_customer_id
    );
    getInstallationsSubscribed = `/api/stripe/get-userinfo-subscriptions?userId=${userId}&jwtToken=${jwtToken}&customerIds=${customerIds}`;
  }

  const { data: installationsSubscribed } = useSWR(
    getInstallationsSubscribed,
    () => fetchWithCache(getInstallationsSubscribed, "installationsSubscribed"),
    swrOptions
  );

  useEffect(() => {
    // Set Selected Index based on localStorage instead of is_selected flag
    if (!installations) return;
    
    const currentOwnerName = localStorage.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME);
    
    if (currentOwnerName) {
      const newIndex = installations.findIndex(
        (installation: Installation) => installation.owner_name === currentOwnerName
      );
      
      if (newIndex !== -1) {
        setSelectedIndex(newIndex);
      } else if (installations.length > 0) {
        // If stored owner not found, default to first installation
        setSelectedIndex(0);
        // Update localStorage with the first installation's owner name
        localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, installations[0].owner_name);
      }
    } else if (installations.length > 0) {
      // No owner in localStorage, default to first installation
      setSelectedIndex(0);
      // Update localStorage with the first installation's owner name
      localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, installations[0].owner_name);
    }
  }, [installations]);

  useEffect(() => {
    if (!installations) return;
    const newInstallationIds = installations.map((installation: Installation) =>
      Number(installation.installation_id)
    );

    // Only update if the values are different
    if (JSON.stringify(newInstallationIds) !== JSON.stringify(installationIds))
      setInstallationIds(newInstallationIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installations]);

  // If user has no accounts, redirect to github app
  useEffect(() => {
    if (installations && installations.length === 0) router.push(RELATIVE_URLS.REDIRECT_TO_INSTALL);
  }, [installations, router]);

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
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContext);
}

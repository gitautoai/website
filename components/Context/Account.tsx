"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { isTokenExpired } from "@/utils/auth";
import { RELATIVE_URLS } from "@/config/index";

interface Owner {
  owner_id: string;
  stripe_customer_id: string;
  created_at: string;
  created_by: string | null;
}

interface Installation {
  installation_id: string;
  owner_id: string;
  owner_type: "User" | "Organization";
  owner_name: string;
  owners: Owner;
  uninstalled_at: string | null;
  uninstalled_by: string | null;
  created_at: string;
  created_by: string | null;
}

interface User {
  user_name: string;
}

interface UserInfo {
  id: string;
  user_id: string;
  installation_id: string;
  is_user_assigned: boolean;
  first_issue: boolean;
  is_selected: boolean;
  is_active: boolean;
  installations: Installation;
  users: User;
  created_at: string;
  created_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

const AccountContext = createContext<{
  userInfos: UserInfo[] | undefined;
  mutateUserInfos: () => void;
  userInfosSubscribed: boolean[] | null; // whether a given userInfo has a live subscription or not
  selectedIndex: number | null; // Index of selected account
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  userId: number | null;
  userName: string | null;
  email: string | null;
  installationIds: number[];
  jwtToken: string | null;
}>({
  userInfos: undefined,
  mutateUserInfos: () => {},
  userInfosSubscribed: null,
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
  const router = useRouter();

  // Get userId and jwtToken from session object
  useEffect(() => {
    if (!session) return;
    console.log("session", session);
    setUserId(session.user.userId);
    setUserName(session.user.name || "Unknown User Name");
    setEmail(session.user.email || "Unknown Email");
    if (isTokenExpired(session.jwtToken)) {
      signOut({ callbackUrl: "/" });
      return;
    }
    setJwtToken(session.jwtToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.jwtToken, session?.user.email, session?.user.name, session?.user.userId]);

  let getUserInfoUrl = "";
  let getUserInfosSubscribed = "";
  if (userId && jwtToken)
    getUserInfoUrl = `/api/users/get-user-info?userId=${userId}&jwtToken=${jwtToken}`;

  // Common SWR options
  const swrOptions = {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
    suspense: true,
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

  const { data: userInfos, mutate: mutateUserInfos } = useSWR<UserInfo[]>(
    getUserInfoUrl,
    () => fetchWithCache(getUserInfoUrl, "userInfos"),
    swrOptions
  );

  // Get userinfos that have a live subscription
  if (userInfos) {
    const customerIds: string[] = userInfos.map(
      (user: UserInfo) => user.installations.owners.stripe_customer_id
    );
    getUserInfosSubscribed = `/api/stripe/get-userinfo-subscriptions?userId=${userId}&jwtToken=${jwtToken}&customerIds=${customerIds}`;
  }

  const { data: userInfosSubscribed } = useSWR(
    getUserInfosSubscribed,
    () => fetchWithCache(getUserInfosSubscribed, "userInfosSubscribed"),
    swrOptions
  );

  useEffect(() => {
    async function setInstallationFallback() {
      await fetch("/api/users/set-installation-fallback", {
        method: "POST",
        body: JSON.stringify({ userId: userId, jwtToken: jwtToken }),
      });
    }

    // Set Selected Index if there is a selected user account
    if (!userInfos) return;
    const newIndex = userInfos.findIndex((user: any) => user.is_selected);

    // Should always have an account selected, this is a fallback
    if (newIndex === -1) {
      console.error("No selected index found");
      setInstallationFallback();
    } else {
      setSelectedIndex(newIndex);
    }
  }, [userInfos, userId, jwtToken, router]);

  useEffect(() => {
    if (!userInfos) return;
    const newInstallationIds = userInfos.map((user: any) =>
      user.installations.installation_id.replace("n", "")
    );

    // Only update if the values are different
    if (JSON.stringify(newInstallationIds) !== JSON.stringify(installationIds))
      setInstallationIds(newInstallationIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfos]);

  // If user has no accounts, redirect to github app
  useEffect(() => {
    if (userInfos && userInfos.length === 0) router.push(RELATIVE_URLS.REDIRECT_TO_INSTALL);
  }, [userInfos, router]);

  return (
    <AccountContext.Provider
      value={{
        userInfos,
        mutateUserInfos,
        userInfosSubscribed,
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

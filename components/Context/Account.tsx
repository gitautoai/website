"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Utils
import { isTokenExpired } from "@/utils/auth";

// Third Party
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { RELATIVE_URLS } from "@/config";

const AccountContext = createContext<{
  userInfos: any; // All users, installations, owners associated with this github account
  mutateUserInfos: () => void;
  userInfosSubscribed: boolean[] | null; // whether a given userInfo has a live subscription or not
  selectedIndex: number | null; // Index of selected account
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  userId: number | null;
  email: string | null;
  jwtToken: string | null;
}>({
  userInfos: null,
  mutateUserInfos: () => {
    ("");
  },
  userInfosSubscribed: null,
  selectedIndex: null,
  setSelectedIndex: () => {
    ("");
  },
  userId: null,
  email: null,
  jwtToken: null,
});

export function AccountContextWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const router = useRouter();

  // Get userId and jwtToken from session object
  useEffect(() => {
    const fetchSession = async () => {
      if (
        session &&
        session.user &&
        session.jwtToken &&
        session.user.name &&
        session.user.image &&
        session.user.email
      ) {
        setUserId(session.user.userId);
        setEmail(session.user.email);
        if (isTokenExpired(session.jwtToken)) {
          signOut({ callbackUrl: "/" });
        }
        setJwtToken(session.jwtToken);
      }
    };
    fetchSession();
  }, [session]);

  let getUserInfoUrl = "";
  let getUserInfosSubscribed = "";
  if (userId && jwtToken) {
    getUserInfoUrl = `/api/users/get-user-info?userId=${userId}&jwtToken=${jwtToken}`;
  }

  const { data: userInfos, mutate: mutateUserInfos } = useSWR(getUserInfoUrl, async () => {
    const res = await fetch(getUserInfoUrl);
    return res.json();
  });

  // Get userinfos that have a live subscription
  if (userInfos) {
    const customerIds = userInfos.map((user: any) => user.installations.owners.stripe_customer_id);

    getUserInfosSubscribed = `/api/stripe/get-userinfo-subscriptions?userId=${userId}&jwtToken=${jwtToken}&customerIds=${customerIds}`;
  }

  const { data: userInfosSubscribed } = useSWR(getUserInfosSubscribed, async () => {
    const res = await fetch(getUserInfosSubscribed);
    return res.json();
  });

  useEffect(() => {
    async function setInstallationFallback() {
      await fetch("/api/users/set-installation-fallback", {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          jwtToken: jwtToken,
        }),
      });
    }

    // Set Selected Index if there is a selected user account
    if (userInfos) {
      const newIndex = userInfos.findIndex((user: any) => user.is_selected);

      // Should always have an account selected, this is a fallback
      if (newIndex == -1) {
        console.error("No selected index found");
        setInstallationFallback();

        // await mutateUserInfos();
      } else {
        setSelectedIndex(newIndex);
      }
    }
  }, [userInfos, selectedIndex, userId, jwtToken, router]);

  // If user has no accounts, redirect to github app
  useEffect(() => {
    if (userInfos && userInfos.length === 0) {
      router.push(RELATIVE_URLS.REDIRECT_TO_INSTALL);
    }
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
        email,
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

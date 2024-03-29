"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Utils
import { isTokenExpired } from "@/utils/auth";

// Third Party
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";

const AccountContext = createContext<{
  account: string | null; // Currently selected account
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  accountType: string | null; // Currently selected account type
  setAccountType: React.Dispatch<React.SetStateAction<string | null>>;
  userInfos: any; // All users, installations, owners associated with this github account
  mutateUserInfos: () => void;
  userInfosSubscribed: boolean[] | null; // whether a given userInfo has a live subscription or not
  selectedIndex: number | null; // Index of selected account
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  userId: number | null;
  jwtToken: string | null;
}>({
  account: null,
  setAccount: () => {
    ("");
  },
  accountType: null,
  setAccountType: () => {
    ("");
  },
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
  jwtToken: null,
});

export function AccountContextWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [account, setAccount] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // Get userId and jwtToken from session object
  useEffect(() => {
    const fetchSession = async () => {
      if (
        session &&
        session.user &&
        session.jwtToken &&
        session.user.name &&
        session.user.image
      ) {
        setUserId(session.user.userId);
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
    getUserInfoUrl = `api/users/get-user-info?userId=${userId}&jwtToken=${jwtToken}`;
  }

  const { data: userInfos, mutate: mutateUserInfos } = useSWR(
    getUserInfoUrl,
    async () => {
      const res = await fetch(getUserInfoUrl);
      return res.json();
    }
  );

  // Get userinfos that have a live subscription
  if (userInfos) {
    const customerIds = userInfos.map(
      (user: any) => user.installations.owners.stripe_customer_id
    );
    console.log("IDS: ", customerIds);
    const empty: string[] = [];
    getUserInfosSubscribed = `api/stripe/get-userinfo-subscriptions?userId=${userId}&jwtToken=${jwtToken}&customerIds=${customerIds}`;
  }

  const { data: userInfosSubscribed } = useSWR(
    getUserInfosSubscribed,
    async () => {
      const res = await fetch(getUserInfosSubscribed);
      return res.json();
    }
  );

  useEffect(() => {
    // Set Selected Index if there is a selected user account
    if (userInfos) {
      const newIndex = userInfos.findIndex((user: any) => user.is_selected);

      if (newIndex == -1) {
        console.error("No selected index found");
        // TODO call api to ensure is_selected is true
        // await mutateUserInfos();
      } else {
        setAccount(userInfos[newIndex].installations.owner_id);
        setAccountType(userInfos[newIndex].installations.owner_type);
        setSelectedIndex(newIndex);
      }
    }
  }, [userInfos, selectedIndex]);

  console.log("sel: ", selectedIndex);
  console.log("userInfos: ", userInfos);
  console.log("userInfosSubscribed: ", userInfosSubscribed);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        accountType,
        setAccountType,
        userInfos,
        mutateUserInfos,
        userInfosSubscribed,
        selectedIndex,
        setSelectedIndex,
        userId: userId as number | null,
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

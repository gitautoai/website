"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Utils
import { isTokenExpired } from "@/utils/auth";

// Third Party
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";

const AccountContext = createContext<{
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  accountType: string | null;
  setAccountType: React.Dispatch<React.SetStateAction<string | null>>;
  userInfos: any;
  selectedIndex: number | null;
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
  selectedIndex: null,
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
  const [userId, setUserId] = useState<number | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [userInfoSubscribed, setUserInfoSubscribed] = useState<
    boolean[] | null
  >(null);

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
  if (userId && jwtToken) {
    getUserInfoUrl = `api/users/get-user-info?userId=${userId}&jwtToken=${jwtToken}`;
  }

  const { data: userInfos } = useSWR(getUserInfoUrl, async () => {
    const res = await fetch(getUserInfoUrl);
    return res.json();
  });

  let selectedIndex = null;
  if (userInfos) {
    selectedIndex = userInfos.findIndex((user: any) => user.is_selected);

    if (selectedIndex == -1) {
      selectedIndex = null;
    }
  }

  console.log(userInfos);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        accountType,
        setAccountType,
        userInfos,
        selectedIndex,
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

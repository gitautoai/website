"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { slackUs } from "@/app/actions/slack/slack-us";
import { useAccountContext } from "@/app/components/contexts/Account";

export default function NotFoundRedirect({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { userId, userName } = useAccountContext();

  useEffect(() => {
    const user = userId ? `${userName} (${userId})` : "anonymous";
    slackUs(`📝 Page not found: ${pathname}\nUser: ${user}`).catch(console.error);
    router.replace(redirectTo);
  }, [userId, userName, pathname, router, redirectTo]);

  return null;
}

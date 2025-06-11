"use client";

import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useAccountContext } from "@/app/components/Context/Account";
import { createPortalOrCheckoutURL } from "@/lib/stripe/createPortalOrCheckoutUrl";

type SubscribeButtonProps = {
  billingPeriod: string;
  className?: string;
};

export default function SubscribeButton({ billingPeriod, className = "" }: SubscribeButtonProps) {
  const posthog = usePostHog();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    userId,
    jwtToken,
    email,
    selectedIndex,
    installationsSubscribed,
    userName,
    currentOwnerId,
    currentOwnerType,
    currentOwnerName,
    currentStripeCustomerId,
  } = useAccountContext();

  async function handleSubscribe() {
    setIsLoading(true);
    posthog.capture("$click", { $event_type: "subscribe", $current_url: window.location.href });

    try {
      if (!userId || !jwtToken) {
        await signIn("github", { callbackUrl: window.location.pathname });
        return;
      }

      if (!currentOwnerId || !currentOwnerType || !currentOwnerName) return;
      if (!currentStripeCustomerId) return;
      if (!email) return;

      await createPortalOrCheckoutURL({
        userId,
        jwtToken,
        customerId: currentStripeCustomerId,
        email,
        ownerId: currentOwnerId,
        ownerType: currentOwnerType,
        ownerName: currentOwnerName,
        userName,
        billingPeriod,
        router,
      });
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error subscribing", error);
    } finally {
      setIsLoading(false);
    }
  }

  const buttonText =
    selectedIndex != null &&
    installationsSubscribed &&
    installationsSubscribed[selectedIndex] === true
      ? "Manage"
      : "Subscribe";

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`py-2 px-4 rounded-lg font-medium bg-pink-600 text-white hover:bg-pink-700 ${
        isLoading ? "opacity-75 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading ? "Loading..." : buttonText}
    </button>
  );
}

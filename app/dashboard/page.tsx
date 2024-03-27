"use client";
// NextJs imports
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

// Components
import Footer from "@/components/Footer";
import SwitchAccount from "@/components/Dashboard/SwitchAccount";
import { useAccountContext } from "@/components/Context/Account";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";

// Third Party
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { usePostHog } from "posthog-js/react";

export default function Home() {
  // Hooks
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { account, accountType, userInfos, selectedIndex, userId, jwtToken } =
    useAccountContext();

  // Analytics
  const pathname = usePathname();
  const posthog = usePostHog();
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, posthog]);

  // TODO
  // If "subscribe" in query parameter from "Subscribe" button on homepage, create checkout session or portal
  useEffect(() => {
    async function createCheckoutSession() {
      let customerId = "";
      if (selectedIndex) {
        customerId =
          userInfos[selectedIndex].installations.owners.stripe_customer_id;
      } else {
        customerId = userInfos[0].installations.owners.stripe_customer_id;
      }
      const response = await fetch("api/stripe/create-portal-url", {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          jwtToken: jwtToken,
          customerId: customerId,
        }),
      });

      const res = await response.json();
      router.push(res);
      return await res;
    }

    if (searchParams.has("subscribe")) {
      createCheckoutSession();
    }
  }, [searchParams, userInfos, selectedIndex, userId, jwtToken, router]);

  async function pushToStripePortal() {
    if (selectedIndex) {
      const response = await fetch("api/stripe/create-portal-url", {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          jwtToken: jwtToken,
          customerId:
            userInfos[selectedIndex].installations.owners.stripe_customer_id,
        }),
      });

      const res = await response.json();
      router.push(res);
      return await res;
    }
  }

  if (status === "loading" || searchParams.has("subscribe") || !userInfos) {
    return <LoadingSpinner />;
  }

  return (
    <div className=" bg-light text-black ">
      <div className="min-h-[calc(100vh-232px)]">
        <h2 className="text-center pt-16 text-4xl">Dashboard</h2>
        <div className="flex flex-col items-center bg-light h-full mt-10">
          <div className="w-[98vw] md:w-[95vw] lg:w-[90vw] xl:w-[80vw] 2xl:w-[1280px] ">
            {!selectedIndex ? (
              <SwitchAccount isOpen={true} onClose={() => {}} />
            ) : (
              <>
                <div>
                  {accountType === "U" && (
                    <div>
                      User account <b>{userInfos[selectedIndex].user_name}</b>{" "}
                      selected. Want to purchase individual plan?&nbsp;
                      <a
                        href="https://stripe.com"
                        target="_blank"
                        className="text-pink underline"
                      >
                        Click Here
                      </a>
                    </div>
                  )}
                  {accountType === "O" && (
                    <div className="flex flex-col items-center">
                      <div className="flex flex-col gap-5">
                        <span>
                          Organization account{" "}
                          <b>
                            {userInfos[selectedIndex].installations.owner_name}
                          </b>{" "}
                          selected.
                        </span>{" "}
                        <span> Want to purchase a plan?</span>
                        <button
                          onClick={() => {
                            pushToStripePortal();
                          }}
                          className="underline"
                        >
                          Manage Payments
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

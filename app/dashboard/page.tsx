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
import { usePostHog } from "posthog-js/react";
import { Spinner } from "@chakra-ui/react";

const pricingButtonStyles = `my-8 rounded-lg transition-colors  duration-200 
text-md sm:text-lg xl:text-xl py-3 w-[250px] sm:w-[315px] lg:w-[210px] shadow-lg hover:shadow-lg 
cursor-pointer font-semibold text-center mx-auto `;

export default function Home() {
  // Hooks
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accountType, userInfos, selectedIndex, userId, jwtToken } =
    useAccountContext();

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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

  // If "subscribe" in query parameter from "Subscribe" button on homepage, create checkout session or portal
  useEffect(() => {
    async function createPortalURL() {
      let currentIndex = 0;
      if (selectedIndex) {
        currentIndex = selectedIndex;
      }
      const response = await fetch("api/stripe/create-portal-or-checkout-url", {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          jwtToken: jwtToken,
          customerId:
            userInfos[currentIndex].installations.owners.stripe_customer_id,
          ownerType: userInfos[currentIndex].installations.owner_type,
          ownerId: userInfos[currentIndex].installations.owner_id,
          ownerName: userInfos[currentIndex].installations.owner_name,
          userName: userInfos[currentIndex].user_name,
        }),
      });

      const res = await response.json();
      router.push(res);
    }

    if (searchParams.has("subscribe")) {
      createPortalURL();
    }
  }, [searchParams, userInfos, selectedIndex, userId, jwtToken, router]);

  async function pushToStripePortal() {
    setIsPaymentLoading(true);
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
    } else {
      setIsPaymentLoading(false);
    }
  }

  if (status === "loading" || searchParams.has("subscribe") || !userInfos) {
    return (
      <>
        <LoadingSpinner />
        <Footer />
      </>
    );
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
                        <div className="relative items-center">
                          <button
                            onClick={() => {
                              pushToStripePortal();
                            }}
                            className={`${pricingButtonStyles} bg-white hover:bg-[#E6E6E6] text-black  ${
                              isPaymentLoading &&
                              "opacity-0 pointer-events-none"
                            }`}
                          >
                            Subscribe
                          </button>
                          {isPaymentLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white opacity-50 rounded-lg my-8 py-3 w-[250px] sm:w-[315px] lg:w-[210px] cursor-not-allowed ">
                              <Spinner size="md" color="pink" />
                            </div>
                          )}
                        </div>
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

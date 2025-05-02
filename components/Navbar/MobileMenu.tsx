"use client";
// Third Party
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

// Components
import { useAccountContext } from "@/components/Context/Account";
import { ABSOLUTE_URLS } from "@/config/index";
import { INTERNAL_LINKS } from "@/config/internal-links";
import { Installation } from "@/types/github";
import OwnerSelector from "../HomePage/OwnerSelector";

interface MobileDrawerProps {
  setIsNavOpen: (prev: boolean) => void;
  isNavOpen: boolean;
  posthog: any;
}

const buttonStyles = `bg-pink-600 text-white rounded-lg transition-colors 
duration-200 sm:text-md xl:text-lg py-2 px-3 shadow-lg hover:shadow-lg 
cursor-pointer hover:bg-pink-700 font-semibold text-center md:w-auto `;

export default function MobileDrawer({ setIsNavOpen, isNavOpen, posthog }: MobileDrawerProps) {
  const { status } = useSession();
  const [isOwnerSelectorOpen, setIsOwnerSelectorOpen] = useState(false);
  const {
    userId,
    jwtToken,
    email,
    installations,
    selectedIndex,
    installationsSubscribed,
    userName,
  } = useAccountContext();

  const router = useRouter();

  const createPortalOrCheckoutURL = async (
    userId: number | null,
    jwtToken: string | null,
    installations: Installation[],
    currentIndex: number
  ) => {
    const response = await fetch("/api/stripe/create-portal-or-checkout-url", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        jwtToken: jwtToken,
        customerId: installations[currentIndex].stripe_customer_id,
        email: email,
        ownerType: installations[currentIndex].owner_type,
        ownerId: Number(installations[currentIndex].owner_id),
        ownerName: installations[currentIndex].owner_name,
        userName: userName || "Unknown User",
      }),
    });

    const res = await response.json();
    router.push(res);
  };

  return (
    <>
      {isNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsNavOpen(false)} />
      )}
      <div
        className={`fixed inset-y-0 right-0 w-full bg-white z-50 transform transition-transform duration-300 text-xl ${
          isNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full p-0">
          <ol className="h-screen flex flex-col items-center justify-center gap-3.5">
            {INTERNAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsNavOpen(false)}
                  className="whitespace-nowrap transition duration-[325ms] link outline-none"
                >
                  {link.text}
                </Link>
              </li>
            ))}
            {status === "unauthenticated" && (
              <li>
                <motion.button
                  whileHover={{ scale: 1.04, transition: { duration: 0.1 } }}
                  whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                  onClick={() => signIn("github", { callbackUrl: `/` })}
                  className="border border-pink-600 text-black rounded-lg transition-colors duration-200 py-1 px-3 whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer"
                >
                  Sign In
                </motion.button>
              </li>
            )}
            {status === "authenticated" && (
              <>
                {selectedIndex != null &&
                  installations &&
                  installations.length > 0 &&
                  installationsSubscribed &&
                  installationsSubscribed[selectedIndex] === true && (
                    <li>
                      <span
                        className={`link `}
                        onClick={() =>
                          createPortalOrCheckoutURL(userId, jwtToken, installations, selectedIndex)
                        }
                      >
                        Manage Subscriptions
                      </span>
                    </li>
                  )}

                {installations && installations.length > 0 && (
                  <li>
                    <span className={`link`} onClick={() => setIsOwnerSelectorOpen(true)}>
                      Switch Account
                    </span>
                  </li>
                )}

                <li onClick={() => signOut({ callbackUrl: "/" })}>
                  <span className="link">Sign Out</span>
                </li>
              </>
            )}
          </ol>
        </div>
      </div>
      <OwnerSelector isOpen={isOwnerSelectorOpen} onClose={() => setIsOwnerSelectorOpen(false)} />
    </>
  );
}

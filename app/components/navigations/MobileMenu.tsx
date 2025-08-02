"use client";

// Third Party Imports
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

// Local Imports
import { createCustomerPortalSession } from "@/app/actions/stripe/create-customer-portal-session";
import { useAccountContext } from "@/app/components/contexts/Account";
import OwnerSelector from "@/app/components/home/OwnerSelector";
import { INTERNAL_LINKS } from "@/config/internal-links";
import { DEFAULT_SIGNIN_REDIRECT } from "@/config/urls";

interface MobileDrawerProps {
  setIsNavOpen: (prev: boolean) => void;
  isNavOpen: boolean;
}

export default function MobileDrawer({ setIsNavOpen, isNavOpen }: MobileDrawerProps) {
  const { status } = useSession();
  const pathname = usePathname();
  const [isOwnerSelectorOpen, setIsOwnerSelectorOpen] = useState(false);
  const {
    userId,
    jwtToken,
    email,
    installations,
    userName,
    currentOwnerId,
    currentOwnerType,
    currentOwnerName,
    currentStripeCustomerId,
  } = useAccountContext();

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
          <ol className="h-screen flex flex-col items-center justify-center gap-2.5">
            {INTERNAL_LINKS.filter((link) => link.showInMobile).map((link) => (
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
                <button
                  onClick={() =>
                    signIn("github", {
                      callbackUrl:
                        pathname.startsWith("/dashboard") || pathname.startsWith("/settings")
                          ? pathname
                          : DEFAULT_SIGNIN_REDIRECT,
                    })
                  }
                  className="border border-pink-600 text-black rounded-lg transition-all duration-200 py-1 px-3 whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                >
                  Sign In
                </button>
              </li>
            )}
            {status === "authenticated" && (
              <>
                {userId &&
                  jwtToken &&
                  email &&
                  currentOwnerId &&
                  currentOwnerType &&
                  currentOwnerName &&
                  currentStripeCustomerId && (
                    <li>
                      <span
                        className={`link `}
                        onClick={async () => {
                          try {
                            const portalUrl = await createCustomerPortalSession({
                              stripe_customer_id: currentStripeCustomerId,
                              return_url: window.location.href,
                            });
                            window.location.href = portalUrl;
                          } catch (error) {
                            console.error("Error creating customer portal session:", error);
                          }
                        }}
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

                <li onClick={() => signOut({ callbackUrl: pathname })}>
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

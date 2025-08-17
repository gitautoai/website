"use client";

// Third party imports
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

// Local
import { createCustomerPortalSession } from "@/app/actions/stripe/create-customer-portal-session";
import { useAccountContext } from "@/app/components/contexts/Account";
import OwnerSelectorModal from "@/app/components/home/OwnerSelectorModal";

interface ProfileIconProps {
  session: Session | null;
  mobileMenuTrigger?: boolean;
}

const ProfileIcon = ({ session, mobileMenuTrigger = false }: ProfileIconProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOwnerSelectorOpen, setIsOwnerSelectorOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const {
    userId,
    jwtToken,
    email,
    installations,
    currentOwnerId,
    currentOwnerType,
    currentOwnerName,
    currentStripeCustomerId,
    userName,
  } = useAccountContext();

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Skip rendering the menu if this is a mobile menu trigger
  if (mobileMenuTrigger) {
    return (
      <Image
        height="40"
        width="40"
        className="rounded-full"
        priority={true}
        alt={session?.user?.name || "A round user profile picture"}
        src={session?.user?.image || ""}
      />
    );
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center focus:outline-none"
        >
          <Image
            height="40"
            width="40"
            className="rounded-full"
            priority={true}
            alt={session?.user?.name || "A round user profile picture"}
            src={session?.user?.image || ""}
          />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 py-1 rounded-md shadow-lg bg-white">
            {(() => {
              if (
                !userId ||
                !jwtToken ||
                !email ||
                !currentOwnerId ||
                !currentOwnerType ||
                !currentOwnerName ||
                !currentStripeCustomerId
              ) {
                console.log("ProfileIcon: falsy values", {
                  userId,
                  jwtToken,
                  email,
                  currentOwnerId,
                  currentOwnerType,
                  currentOwnerName,
                  currentStripeCustomerId,
                });
              }
              return null;
            })()}

            {userId &&
              jwtToken &&
              email &&
              currentOwnerId &&
              currentOwnerType &&
              currentOwnerName &&
              currentStripeCustomerId && (
                <button
                  className="w-full text-left px-4 py-2"
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
                  <span className="link">Manage Subscriptions</span>
                </button>
              )}

            {installations && installations.length > 0 && (
              <button
                className="w-full text-left px-4 py-2"
                onClick={() => {
                  setIsOwnerSelectorOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <span className="link">Switch Account</span>
              </button>
            )}

            <button
              className="w-full text-left px-4 py-2"
              onClick={() => signOut({ callbackUrl: pathname })}
            >
              <span className="link">Sign Out</span>
            </button>
          </div>
        )}
      </div>
      <OwnerSelectorModal
        isOpen={isOwnerSelectorOpen}
        onClose={() => setIsOwnerSelectorOpen(false)}
      />
    </>
  );
};

export default ProfileIcon;

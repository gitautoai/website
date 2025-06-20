"use client";

// Third party imports
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

// Local
import { useAccountContext } from "@/app/components/contexts/Account";
import OwnerSelector from "@/app/components/home/OwnerSelector";
import { createPortalOrCheckoutURL } from "@/lib/stripe/createPortalOrCheckoutUrl";

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
          <div className="absolute right-0 mt-2 w-48 py-1 rounded-md shadow-lg">
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
                  className="w-full text-left px-4 py-2 hover:bg-transparent"
                  onClick={() =>
                    createPortalOrCheckoutURL({
                      userId,
                      jwtToken,
                      customerId: currentStripeCustomerId,
                      email,
                      ownerId: currentOwnerId,
                      ownerType: currentOwnerType,
                      ownerName: currentOwnerName,
                      userName,
                      router,
                    })
                  }
                >
                  <span className="link">Manage Subscriptions</span>
                </button>
              )}

            {installations && installations.length > 0 && (
              <button
                className="w-full text-left px-4 py-2 hover:bg-transparent"
                onClick={() => {
                  setIsOwnerSelectorOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <span className="link">Switch Account</span>
              </button>
            )}

            <button
              className="w-full text-left px-4 py-2 hover:bg-transparent"
              onClick={() => signOut({ callbackUrl: pathname })}
            >
              <span className="link">Sign Out</span>
            </button>
          </div>
        )}
      </div>
      <OwnerSelector isOpen={isOwnerSelectorOpen} onClose={() => setIsOwnerSelectorOpen(false)} />
    </>
  );
};

export default ProfileIcon;

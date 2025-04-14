"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

// Local
import OwnerSelector from "@/components/HomePage/OwnerSelector";
import { useAccountContext } from "@/components/Context/Account";
import { Installation } from "@/types/github";

interface ProfileIconProps {
  session: Session | null;
  mobileMenuTrigger?: boolean;
}

const ProfileIcon = ({ session, mobileMenuTrigger = false }: ProfileIconProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOwnerSelectorOpen, setIsOwnerSelectorOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
            {selectedIndex != null &&
              installations &&
              installations.length > 0 &&
              installationsSubscribed &&
              installationsSubscribed[selectedIndex] === true && (
                <button
                  className="w-full text-left px-4 py-2 hover:bg-transparent"
                  onClick={() =>
                    createPortalOrCheckoutURL(userId, jwtToken, installations, selectedIndex)
                  }
                >
                  <span className="link">Manage Payment</span>
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
              onClick={() => signOut({ callbackUrl: "/" })}
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

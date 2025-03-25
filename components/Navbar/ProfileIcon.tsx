"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Menu, MenuButton, MenuList, MenuItem, useDisclosure } from "@chakra-ui/react";

// Local
import OwnerSelector from "@/components/HomePage/OwnerSelector";
import { useAccountContext } from "@/components/Context/Account";
import { Installation } from "@/types/github";

interface ProfileIconProps {
  session: Session | null;
  mobileMenuTrigger?: boolean;
}

const ProfileIcon = ({ session, mobileMenuTrigger = false }: ProfileIconProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Menu isLazy>
        <MenuButton>
          <Image
            height="40"
            width="40"
            className="rounded-full"
            // loading="lazy"
            priority={true}
            alt={session?.user?.name || "A round user profile picture"}
            src={session?.user?.image || ""}
          />
        </MenuButton>
        <MenuList>
          {selectedIndex != null &&
            installations &&
            installations.length > 0 &&
            installationsSubscribed &&
            installationsSubscribed[selectedIndex] === true && (
              <MenuItem
                _hover={{
                  bg: "none",
                }}
                _focus={{ bg: "none" }}
                _active={{ bg: "none" }}
              >
                <span
                  className={`link `}
                  onClick={() =>
                    createPortalOrCheckoutURL(userId, jwtToken, installations, selectedIndex)
                  }
                >
                  Manage Payment
                </span>
              </MenuItem>
            )}

          {installations && installations.length > 0 && (
            <MenuItem
              _hover={{
                bg: "none",
              }}
              _focus={{ bg: "none" }}
              _active={{ bg: "none" }}
              onClick={onOpen}
            >
              <span className={`link`}>Switch Account</span>
            </MenuItem>
          )}

          <MenuItem
            _hover={{
              bg: "none",
            }}
            _focus={{ bg: "none" }}
            _active={{ bg: "none" }}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <span className="link">Sign Out</span>
          </MenuItem>
        </MenuList>
      </Menu>
      <OwnerSelector isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ProfileIcon;

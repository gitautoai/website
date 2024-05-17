"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

// components
import SwitchAccount from "@/components/HomePage/SwitchAccount";
import { useAccountContext } from "@/components/Context/Account";

// Third Party
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";

interface ProfileIconProps {
  session: Session | null;
}

const ProfileIcon = ({ session }: ProfileIconProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    userId,
    jwtToken,
    email,
    userInfos,
    selectedIndex,
    userInfosSubscribed,
  } = useAccountContext();

  const router = useRouter();

  const createPortalOrCheckoutURL = async (
    userId: number | null,
    jwtToken: string | null,
    userInfos: any,
    currentIndex: number
  ) => {
    const response = await fetch("/api/stripe/create-portal-or-checkout-url", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        jwtToken: jwtToken,
        customerId:
          userInfos[currentIndex].installations.owners.stripe_customer_id,
        email: email,
        ownerType: userInfos[currentIndex].installations.owner_type,
        ownerId: Number(
          userInfos[currentIndex].installations.owner_id.replace("n", "")
        ),
        ownerName: userInfos[currentIndex].installations.owner_name,
        userName: userInfos[currentIndex].users.user_name,
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
            priority={true}
            alt={session?.user?.name || ""}
            src={session?.user?.image || ""}
          />
        </MenuButton>
        <MenuList>
          {selectedIndex != null &&
            userInfosSubscribed &&
            userInfosSubscribed[selectedIndex] === true && (
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
                    createPortalOrCheckoutURL(
                      userId,
                      jwtToken,
                      userInfos,
                      selectedIndex
                    )
                  }
                >
                  Manage Payment
                </span>
              </MenuItem>
            )}

          {userInfos && userInfos.length > 0 && (
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
      <SwitchAccount isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ProfileIcon;

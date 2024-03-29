import Image from "next/image";
import { useRouter } from "next/navigation";
// components
import SwitchAccount from "@/components/HomePage/SwitchAccount";
import { useAccountContext } from "@/components/Context/Account";

// Third Party
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { motion } from "framer-motion";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";

const MotionMenuList = motion(MenuList);

interface ProfileIconProps {
  session: Session | null;
}
const variants = {
  open: {
    opacity: 1,
    y: 0,
    display: "block",
    transition: { duration: 1 },
  },
  closed: {
    opacity: 0,
    y: -20,
    transitionEnd: {
      display: "none",
    },
    transition: { duration: 1 },
  },
};

const ProfileIcon = ({ session }: ProfileIconProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selectedIndex, userInfosSubscribed } = useAccountContext();
  const router = useRouter();
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
        <MotionMenuList
          variants={variants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          {selectedIndex && userInfosSubscribed && (
            <>
              {userInfosSubscribed[selectedIndex] === true ? (
                <MenuItem
                  _hover={{
                    bg: "none",
                  }}
                  _focus={{ bg: "none" }}
                  _active={{ bg: "none" }}
                >
                  <span className={`link `}>Manage Payment</span>
                </MenuItem>
              ) : (
                <MenuItem
                  _hover={{
                    bg: "none",
                  }}
                  _focus={{ bg: "none" }}
                  _active={{ bg: "none" }}
                >
                  <span
                    className={`link `}
                    onClick={() => router.push("/?subscribe")}
                  >
                    Subscribe
                  </span>
                </MenuItem>
              )}
            </>
          )}

          <MenuItem
            _hover={{
              bg: "none",
            }}
            _focus={{ bg: "none" }}
            _active={{ bg: "none" }}
          >
            <span className={`link `} onClick={onOpen}>
              Switch Account
            </span>
          </MenuItem>

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
        </MotionMenuList>
      </Menu>
      <SwitchAccount isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ProfileIcon;

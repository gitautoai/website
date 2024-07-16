import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import { useAccountContext } from "@/components/Context/Account";

// Styling
import { Drawer, DrawerContent, DrawerBody, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Third Party
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@chakra-ui/react";
import SwitchAccount from "../HomePage/SwitchAccount";
import { config } from "@/config";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { userId, jwtToken, email, userInfos, selectedIndex, userInfosSubscribed } =
    useAccountContext();

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
        customerId: userInfos[currentIndex].installations.owners.stripe_customer_id,
        email: email,
        ownerType: userInfos[currentIndex].installations.owner_type,
        ownerId: Number(userInfos[currentIndex].installations.owner_id.replace("n", "")),
        ownerName: userInfos[currentIndex].installations.owner_name,
        userName: userInfos[currentIndex].users.user_name,
      }),
    });

    const res = await response.json();
    router.push(res);
  };

  return (
    <Drawer isOpen={isNavOpen} size="full" onClose={() => setIsNavOpen(!isNavOpen)}>
      <DrawerContent className="text-3xl">
        <DrawerBody p={0}>
          <ol className={`flex flex-col items-center justify-center gap-16 mt-24`}>
            <li>
              <Link
                href="/#use-cases"
                onClick={() => {
                  setIsNavOpen(false);
                }}
                className="whitespace-nowrap transition duration-[325ms] link outline-none"
              >
                Use Cases
              </Link>
            </li>
            <li>
              <Link
                href="/#pricing"
                onClick={() => {
                  setIsNavOpen(false);
                }}
                className="whitespace-nowrap transition duration-[325ms] link"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                onClick={() => {
                  setIsNavOpen(false);
                }}
                className="whitespace-nowrap transition duration-[325ms] link"
              >
                FAQ
              </Link>
            </li>
            {status === "unauthenticated" && (
              <>
                <li>
                  <Link
                    href={config.NEXT_PUBLIC_GITHUB_APP_URL as string}
                    target="_blank"
                    onClick={() => {
                      posthog.capture("$click", {
                        $event_type: "github_app_install_nav",
                      });
                      setIsNavOpen(false);
                    }}
                    className={`${buttonStyles}`}
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                      transition: { duration: 0.1 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { duration: 0.1 },
                    }}
                    onClick={() => {
                      signIn("github", {
                        callbackUrl: `/`,
                      });
                    }}
                    className="border border-pink-600 text-black rounded-lg transition-colors duration-200 py-1 px-3 whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Sign In
                  </motion.button>
                </li>
              </>
            )}
            {status === "authenticated" && (
              <>
                {selectedIndex != null &&
                  userInfosSubscribed &&
                  userInfosSubscribed[selectedIndex] === true && (
                    <li>
                      <span
                        className={`link `}
                        onClick={() =>
                          createPortalOrCheckoutURL(userId, jwtToken, userInfos, selectedIndex)
                        }
                      >
                        Manage Payment
                      </span>
                    </li>
                  )}

                {userInfos && userInfos.length > 0 && (
                  <li onClick={onOpen}>
                    <span className={`link`}>Switch Account</span>
                  </li>
                )}

                <li onClick={() => signOut({ callbackUrl: "/" })}>
                  <span className="link">Sign Out</span>
                </li>
                <SwitchAccount isOpen={isOpen} onClose={onClose} />
              </>
            )}
          </ol>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

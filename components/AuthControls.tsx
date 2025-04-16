import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import ProfileIcon from "@/components/Navbar/ProfileIcon";
import Link from "next/link";
import { ABSOLUTE_URLS } from "@/config/index";
import { usePostHog } from "posthog-js/react";

// Reusing the same button styles from Navbar
const buttonStyles = `bg-pink-600 text-white rounded-lg transition-colors 
duration-200 py-2 px-3 shadow-lg hover:shadow-lg 
cursor-pointer hover:bg-pink-700 text-center md:w-auto`;

interface AuthControlsProps {
  callbackUrl?: string;
  mobileMenuTrigger?: boolean;
}

export default function AuthControls({
  callbackUrl = "/",
  mobileMenuTrigger = false,
}: AuthControlsProps) {
  const { data: session, status } = useSession();
  const posthog = usePostHog();

  return (
    <>
      {status === "unauthenticated" && (
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
              callbackUrl,
            });
          }}
          className="border border-pink-600 text-black rounded-lg transition-colors duration-200 py-1 px-3 whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer"
        >
          Sign In
        </motion.button>
      )}
      {status === "authenticated" && (
        <ProfileIcon session={session} mobileMenuTrigger={mobileMenuTrigger} />
      )}
    </>
  );
}

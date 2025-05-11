// Third party imports
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { usePostHog } from "posthog-js/react";

// Local imports
import ProfileIcon from "@/app/components/Navbar/ProfileIcon";

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

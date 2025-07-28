// Third party imports
import { usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { usePostHog } from "posthog-js/react";

// Local imports
import ProfileIcon from "@/app/components/navigations/ProfileIcon";
import { DEFAULT_SIGNIN_REDIRECT } from "@/config/urls";

interface AuthControlsProps {
  mobileMenuTrigger?: boolean;
}

export default function AuthControls({ mobileMenuTrigger = false }: AuthControlsProps) {
  const { data: session, status } = useSession();
  const posthog = usePostHog();
  const pathname = usePathname();

  return (
    <>
      {status === "unauthenticated" && (
        <button
          onClick={() => signIn("github", { callbackUrl: pathname.startsWith("/dashboard") || pathname.startsWith("/settings") ? pathname : DEFAULT_SIGNIN_REDIRECT })}
          className="border border-pink-600 text-black rounded-lg transition-all duration-200 py-1 px-3 whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer hover:scale-105 active:scale-95"
        >
          Sign In
        </button>
      )}
      {status === "authenticated" && (
        <ProfileIcon session={session} mobileMenuTrigger={mobileMenuTrigger} />
      )}
    </>
  );
}

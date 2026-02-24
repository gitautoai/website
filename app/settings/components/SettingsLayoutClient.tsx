"use client";

// Third party imports
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

// Local imports
import { slackUs } from "@/app/actions/slack/slack-us";
import AuthControls from "@/app/components/AuthControls";
import { useAccountContext } from "@/app/components/contexts/Account";
import MobileSettingsMenu from "@/app/settings/components/MobileSettingsMenu";

export default function SettingsLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const { userId, userName, currentOwnerName } = useAccountContext();

  // Check if this is OG image generation
  const isOgGeneration = searchParams.get("og-generation") === "true";

  // Only redirect in browser environment, not during static generation/OG image generation
  useEffect(() => {
    if (!isOgGeneration && status === "unauthenticated") {
      signIn("github", { callbackUrl: pathname });
    }
  }, [status, pathname, isOgGeneration]);

  // Notify on page visit
  useEffect(() => {
    if (!userId || !userName || !currentOwnerName) return;
    const pageName = pathname.split("/").pop() || "home";
    slackUs(`${userName} (${userId}) visited ${pageName} page for ${currentOwnerName}`);
  }, [userId, userName, currentOwnerName, pathname]);

  return (
    <>
      {/* Auth Controls - Top Right */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-2">
        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <AuthControls />
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <div onClick={() => setIsMobileMenuOpen(true)}>
            <AuthControls mobileMenuTrigger={true} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileSettingsMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={pathname}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-48">
        <div className="max-w-7xl mx-auto px-0 py-8 lg:p-8">{children}</div>
      </main>
    </>
  );
}

"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function InstallationSuccessPopup() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const installationId = searchParams.get("installation_id");
    const setupAction = searchParams.get("setup_action");

    // Show popup if user came from GitHub App installation
    if (installationId && setupAction === "install") {
      setShowPopup(true);

      // Clean up URL by removing query params
      const cleanUrl = pathname;
      router.replace(cleanUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const handleSignIn = () => {
    signIn("github", { callbackUrl: pathname });
    setShowPopup(false);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            🎉 GitAuto Installation Complete!
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            GitAuto is now installed and ready to create unit tests for your repositories.
          </p>

          {status === "unauthenticated" && (
            <>
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-pink-800">
                  <strong>Want to unlock more features?</strong>
                  <br />
                  Sign in to access your coverage dashboard, manage settings, and get detailed
                  insights.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSignIn}
                  className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
                >
                  Sign In for More Features
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </>
          )}

          {status === "authenticated" && (
            <button
              onClick={handleClose}
              className="w-full bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

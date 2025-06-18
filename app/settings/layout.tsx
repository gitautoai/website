"use client";

// Third party imports
import { useState } from "react";

// Local imports
import AuthControls from "@/app/components/AuthControls";
import MobileSettingsMenu from "@/app/settings/components/MobileSettingsMenu";
import SettingsMenu from "@/app/settings/components/SettingsMenu";
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { settingsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Settings - Configure Your Account & Preferences`,
  description: `Configure your GitAuto account settings, preferences, and integrations. Manage GitHub connections, Jira integrations, and customize your automated testing experience.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INDEX,
  images: [{ url: THUMBNAILS.SETTINGS.INDEX, alt: `${PRODUCT_NAME} Settings` }],
  keywords: [
    "GitAuto settings",
    "account configuration",
    "GitHub integration settings",
    "Jira integration",
    "user preferences",
    "automation settings",
  ],
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <JsonLdScript data={settingsJsonLd} />
      <div className="min-h-screen flex">
        {/* Desktop Menu */}
        <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-56 lg:bg-gray-50 lg:border-r">
          <SettingsMenu />
        </div>

        {/* Auth Controls - Top Right */}
        <div className="fixed top-6 right-6 z-40 flex items-center gap-2">
          <div className="hidden lg:block">
            <AuthControls />
          </div>
          <div className="lg:hidden">
            <div onClick={() => setIsMobileMenuOpen(true)}>
              <AuthControls mobileMenuTrigger={true} />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileSettingsMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-48">
          <div className="max-w-7xl mx-auto px-0 py-8 lg:p-8">{children}</div>
        </main>
      </div>
    </>
  );
}

// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import SettingsLayoutClient from "@/app/settings/components/SettingsLayoutClient";
import SettingsMenu from "@/app/settings/components/SettingsMenu";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { settingsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Settings - Configure Your Account & Preferences`,
  description: `Configure GitAuto account settings, preferences, and integrations. Manage GitHub connections, Jira integrations, and automation.`,
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
  return (
    <>
      <JsonLdScript data={settingsJsonLd} />
      <div className="min-h-screen flex">
        {/* Desktop Menu - Server-rendered for SEO */}
        <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-56 lg:bg-gray-50 lg:border-r">
          <SettingsMenu />
        </div>

        {/* Client-side wrapper for auth, mobile menu, and main content */}
        <SettingsLayoutClient>{children}</SettingsLayoutClient>
      </div>
    </>
  );
}

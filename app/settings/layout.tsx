// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import SettingsLayoutClient from "@/app/settings/components/SettingsLayoutClient";
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
  return (
    <>
      <JsonLdScript data={settingsJsonLd} />
      <SettingsLayoutClient>{children}</SettingsLayoutClient>
    </>
  );
}

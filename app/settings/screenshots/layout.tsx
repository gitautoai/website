import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { screenshotsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Screenshot Settings - Configure Visual Testing`,
  description: `Configure screenshot evidence settings for GitAuto visual testing. Set up production URLs, local ports, and startup commands for automated screenshot comparisons.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.SCREENSHOTS,
  images: [{ url: THUMBNAILS.SETTINGS.SCREENSHOTS, alt: `${PRODUCT_NAME} Screenshot Settings` }],
  keywords: [
    "GitAuto screenshot settings",
    "visual testing configuration",
    "screenshot evidence",
    "production URL setup",
    "local development configuration",
  ],
});

export default function ScreenshotsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={screenshotsJsonLd} />
      {children}
    </>
  );
}

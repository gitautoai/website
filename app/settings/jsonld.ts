import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/WebApplication
 */
export const settingsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.INDEX + "#webapplication",
  name: `${PRODUCT_NAME} Settings`,
  description: "Configure GitAuto account settings, integrations, and automation preferences",
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INDEX,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  featureList: [
    "Account management",
    "GitHub integration",
    "Automation preferences",
    "Repository settings",
  ],
  screenshot: THUMBNAILS.SETTINGS.INDEX,
  offers: OFFERS,
};

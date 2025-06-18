import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION = "Configure screenshot capture settings for GitAuto pull requests.";

export const screenshotsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.SCREENSHOTS + "#webapplication",
  name: `${PRODUCT_NAME} Screenshot Settings`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.SCREENSHOTS,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  featureList: [
    "Enable screenshot evidence",
    "Configure production URLs",
    "Set local development ports",
    "Define startup commands",
  ],
  screenshot: THUMBNAILS.SETTINGS.SCREENSHOTS,
  offers: OFFERS,
};

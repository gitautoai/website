import { AUDIENCE, CREATOR } from "@/app/structured-data";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION = "Configure screenshot capture settings for GitAuto pull requests.";

export const screenshotsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.SCREENSHOTS + "#webpage",
  name: `${PRODUCT_NAME} Screenshot Settings`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.SCREENSHOTS,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Screenshot Configuration", description: DESCRIPTION },
};

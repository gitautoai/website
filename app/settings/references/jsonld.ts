import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const referencesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.REFERENCES + "#webapplication",
  name: `${PRODUCT_NAME} Reference Settings`,
  description: "Configure reference URLs and file paths for improved test generation context",
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.REFERENCES,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  featureList: [
    "Add documentation URLs",
    "Configure file path references",
    "Validate URL accessibility",
    "Manage reference limits",
  ],
  screenshot: THUMBNAILS.SETTINGS.REFERENCES,
  offers: OFFERS,
};

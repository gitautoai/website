import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const rulesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES + "#webapplication",
  name: `${PRODUCT_NAME} Rules Settings`,
  description: "Configure custom rules and coding standards for automated test generation",
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  featureList: [
    "Define repository-specific rules",
    "Set coding standards",
    "Configure target branch",
    "Customize test patterns",
  ],
  screenshot: THUMBNAILS.SETTINGS.RULES,
  offers: OFFERS,
};

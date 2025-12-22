import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const circleCIIntegrationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.INTEGRATIONS.CIRCLECI + "#techarticle",
  name: `${PRODUCT_NAME} CircleCI Integration Guide`,
  headline: `${PRODUCT_NAME} CircleCI Integration Guide`,
  description: `Complete guide to configuring CircleCI integration with GitAuto for automatic build log access. Learn how to set up CircleCI tokens to help GitAuto analyze test failures and generate fixes.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.INTEGRATIONS.CIRCLECI,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.INTEGRATIONS.CIRCLECI,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "CircleCI integration",
    "build log access",
    "CircleCI token configuration",
    "GitAuto integrations",
    "CI/CD integration",
    "automated test fixing",
  ],
};

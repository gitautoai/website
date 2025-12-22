import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const npmIntegrationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.INTEGRATIONS.NPM + "#techarticle",
  name: `${PRODUCT_NAME} npm Integration Guide`,
  headline: `${PRODUCT_NAME} npm Integration Guide`,
  description: `Complete guide to configuring npm integration with GitAuto for private package access. Learn how to set up npm tokens for test generation with ESLint, Prettier, TypeScript, and testing frameworks.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.INTEGRATIONS.NPM,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.INTEGRATIONS.NPM,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "npm integration",
    "private package access",
    "npm token configuration",
    "GitAuto integrations",
    "package registry authentication",
    "automated testing setup",
  ],
};

import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const rulesJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.CUSTOMIZATION.REPOSITORY_RULES + "#techarticle",
  name: `${PRODUCT_NAME} Rules Configuration Guide`,
  headline: `${PRODUCT_NAME} Rules Configuration Guide`,
  description: `Complete guide to configuring GitAuto rules for consistent test generation. Learn about structured rules, repository rules, and best practices.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "GitAuto rules",
    "test generation configuration",
    "coding standards",
    "repository rules",
    "structured rules",
    "automated testing configuration",
  ],
};

import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto pre-loads up to 5 existing test files before the agent loop, teaching the model your project's testing patterns by example.";

export const testFilePreloadingJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_FILE_PRELOADING +
    "#techarticle",
  name: `${PRODUCT_NAME} Test File Preloading`,
  headline: `${PRODUCT_NAME} Test File Preloading`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_FILE_PRELOADING,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "test file preloading",
    "testing patterns",
    "context enrichment",
    "test consistency",
    "AI test generation",
  ],
};

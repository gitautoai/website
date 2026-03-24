import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto captures pre-existing errors (e.g., type errors, lint warnings) before test generation, separating new errors from old ones to avoid wasted iterations.";

export const errorBaselinesJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.ERROR_BASELINES + "#techarticle",
  name: `${PRODUCT_NAME} Error Baselines`,
  headline: `${PRODUCT_NAME} Error Baselines`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.ERROR_BASELINES,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "error baselines",
    "TypeScript errors",
    "pre-existing errors",
    "tsc noEmit",
    "AI code generation",
  ],
};

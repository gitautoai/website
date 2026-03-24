import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto implements a model fallback chain from Claude Opus 4.6 down to Sonnet 4.0, automatically switching models when one fails.";

export const modelFallbackJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.MODEL_FALLBACK + "#techarticle",
  name: `${PRODUCT_NAME} Model Fallback`,
  headline: `${PRODUCT_NAME} Model Fallback`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.MODEL_FALLBACK,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "model fallback",
    "resilience",
    "AI models",
    "automatic failover",
    "AI code generation",
  ],
};

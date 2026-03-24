import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto handles HTTP 529 (overloaded) errors with exponential backoff retry, waiting progressively longer between retries.";

export const overloadRetryJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.OVERLOAD_RETRY + "#techarticle",
  name: `${PRODUCT_NAME} Overload Retry`,
  headline: `${PRODUCT_NAME} Overload Retry`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.OVERLOAD_RETRY,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "overload retry",
    "exponential backoff",
    "HTTP 529",
    "error handling",
    "AI code generation",
  ],
};

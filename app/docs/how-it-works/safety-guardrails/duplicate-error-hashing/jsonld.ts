import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto hashes CI error logs to detect when the agent is stuck making the same failing fix repeatedly.";

export const duplicateErrorHashingJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING + "#techarticle",
  name: `${PRODUCT_NAME} Duplicate Error Hashing`,
  headline: `${PRODUCT_NAME} Duplicate Error Hashing`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "duplicate error hashing",
    "stuck agent detection",
    "CI error logs",
    "safety guardrails",
    "error deduplication",
  ],
};

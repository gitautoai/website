import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto uses database inserts as locks to prevent multiple Lambda invocations from processing the same check suite.";

export const raceConditionPreventionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION + "#techarticle",
  name: `${PRODUCT_NAME} Race Condition Prevention`,
  headline: `${PRODUCT_NAME} Race Condition Prevention`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "race condition prevention",
    "database locking",
    "concurrent processing",
    "safety guardrails",
    "webhook deduplication",
  ],
};

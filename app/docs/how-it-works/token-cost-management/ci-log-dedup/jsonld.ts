import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto deduplicates identical CI test errors to reduce token costs. 39 identical Jest failures become one example plus a count.";

export const ciLogDedupJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CI_LOG_DEDUP + "#techarticle",
  name: `${PRODUCT_NAME} CI Log Deduplication`,
  headline: `${PRODUCT_NAME} CI Log Deduplication`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CI_LOG_DEDUP,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "CI log deduplication",
    "token cost reduction",
    "Jest errors",
    "duplicate errors",
    "LLM cost optimization",
  ],
};

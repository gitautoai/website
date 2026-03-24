import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto deduplicates incoming GitHub webhook events using database unique constraints to prevent duplicate processing.";

export const webhookDeduplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.WEBHOOK_DEDUPLICATION + "#techarticle",
  name: `${PRODUCT_NAME} Webhook Deduplication`,
  headline: `${PRODUCT_NAME} Webhook Deduplication`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.WEBHOOK_DEDUPLICATION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "webhook deduplication",
    "duplicate events",
    "GitHub webhooks",
    "safety guardrails",
    "unique constraints",
  ],
};

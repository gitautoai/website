import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto detects transient infrastructure failures like segfaults and network timeouts in CI logs and retries instead of fixing code.";

export const infrastructureFailureDetectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION + "#techarticle",
  name: `${PRODUCT_NAME} Infrastructure Failure Detection`,
  headline: `${PRODUCT_NAME} Infrastructure Failure Detection`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "infrastructure failure detection",
    "flaky CI",
    "transient failures",
    "safety guardrails",
    "CI retry",
  ],
};

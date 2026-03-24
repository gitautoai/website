import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto detects when file edits produce no actual changes and skips the commit to avoid PR noise.";

export const noChangeDetectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.NO_CHANGE_DETECTION + "#techarticle",
  name: `${PRODUCT_NAME} No-Change Detection`,
  headline: `${PRODUCT_NAME} No-Change Detection`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.NO_CHANGE_DETECTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "no-change detection",
    "empty commit prevention",
    "diff comparison",
    "safety guardrails",
    "PR noise reduction",
  ],
};

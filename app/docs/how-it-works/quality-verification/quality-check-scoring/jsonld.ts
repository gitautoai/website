import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto evaluates test quality across 7 categories including adversarial, security, performance, and memory checks, using blob SHA change detection to score tests beyond coverage numbers.";

export const qualityCheckScoringJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECK_SCORING + "#techarticle",
  name: `${PRODUCT_NAME} Quality Check Scoring`,
  headline: `${PRODUCT_NAME} Quality Check Scoring`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECK_SCORING,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "test quality",
    "quality checks",
    "adversarial testing",
    "security testing",
    "blob SHA",
    "change detection",
    "quality verification",
  ],
};

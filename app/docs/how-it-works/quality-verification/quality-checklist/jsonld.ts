import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "The complete GitAuto quality checklist: 41 individual checks across 8 categories including business logic, adversarial, security, performance, memory, error handling, accessibility, and SEO.";

export const qualityChecklistJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECKLIST + "#techarticle",
  name: `${PRODUCT_NAME} Quality Checklist`,
  headline: `${PRODUCT_NAME} Quality Checklist`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECKLIST,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "quality checklist",
    "test quality",
    "security testing",
    "adversarial testing",
    "accessibility testing",
    "performance testing",
    "quality verification",
  ],
};

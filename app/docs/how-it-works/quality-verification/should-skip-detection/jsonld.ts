import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto analyzes source files before test generation to skip files that don't need tests, like type definitions, constants, and import-only files.";

export const shouldSkipDetectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SHOULD_SKIP_DETECTION + "#techarticle",
  name: `${PRODUCT_NAME} Should-Skip Detection`,
  headline: `${PRODUCT_NAME} Should-Skip Detection`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SHOULD_SKIP_DETECTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "skip detection",
    "file analysis",
    "type definitions",
    "test optimization",
    "quality verification",
  ],
};

import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto automatically adds necessary lint-disable comments to test files across TypeScript, Python, and PHP, preventing false linting failures.";

export const lintDisableHeadersJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINT_DISABLE_HEADERS + "#techarticle",
  name: `${PRODUCT_NAME} Lint Disable Headers`,
  headline: `${PRODUCT_NAME} Lint Disable Headers`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINT_DISABLE_HEADERS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "lint disable",
    "eslint disable",
    "pylint disable",
    "test file headers",
    "linting rules",
  ],
};

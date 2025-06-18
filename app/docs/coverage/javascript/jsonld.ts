import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const javascriptCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVASCRIPT + "#techarticle",
  name: `${PRODUCT_NAME} JavaScript / TypeScript Coverage Setup`,
  description:
    "Configure Jest, Vitest, and other JavaScript testing frameworks for GitAuto automation",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVASCRIPT,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.COVERAGE.JAVASCRIPT,
  keywords: ["JavaScript testing", "TypeScript testing", "Jest", "Vitest", "LCOV"],
  programmingLanguage: ["JavaScript", "TypeScript"],
  offers: OFFERS,
};

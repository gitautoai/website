import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const multiLanguageCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.MULTI_LANGUAGE + "#techarticle",
  name: `${PRODUCT_NAME} Multi-Language Coverage Setup`,
  headline: "Multi-Language Repository Coverage Integration Guide",
  description:
    "Configure test coverage for repositories with multiple programming languages like PHP and JavaScript",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.MULTI_LANGUAGE,
  creator: CREATOR,
  author: {
    "@type": "Organization",
    name: "GitAuto",
  },
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.COVERAGE.MULTI_LANGUAGE,
  keywords: ["multi-language coverage", "polyglot repository", "PHP JavaScript coverage", "LCOV"],
  programmingLanguage: ["PHP", "JavaScript", "TypeScript", "Python"],
  datePublished: "2026-01-26",
  dateModified: "2026-01-26",
  offers: OFFERS,
};

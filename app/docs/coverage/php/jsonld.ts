import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const phpCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PHP + "#techarticle",
  name: `${PRODUCT_NAME} PHP Coverage Setup`,
  headline: "PHP PHPUnit Coverage Integration Guide",
  description: "Configure PHPUnit for GitAuto automated test generation",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PHP,
  creator: CREATOR,
  author: {
    "@type": "Organization",
    name: "GitAuto",
  },
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.COVERAGE.PHP,
  keywords: ["PHP testing", "PHPUnit", "test coverage", "LCOV"],
  programmingLanguage: "PHP",
  datePublished: "2025-11-25",
  dateModified: "2025-11-25",
  offers: OFFERS,
};

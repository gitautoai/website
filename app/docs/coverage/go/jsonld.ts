import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const goCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.GO + "#techarticle",
  name: `${PRODUCT_NAME} Go Coverage Setup`,
  headline: "Go Coverage Integration Guide",
  description: "Configure Go test coverage for GitAuto automated test generation",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.GO,
  creator: CREATOR,
  author: {
    "@type": "Organization",
    name: "GitAuto",
  },
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.COVERAGE.GO,
  keywords: ["Go testing", "Golang", "go test", "LCOV"],
  programmingLanguage: "Go",
  datePublished: "2025-11-25",
  dateModified: "2025-11-25",
  offers: OFFERS,
};

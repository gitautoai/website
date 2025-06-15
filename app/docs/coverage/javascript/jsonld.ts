import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure test coverage for JavaScript and TypeScript projects and let GitAuto access it. Supports Jest, Vitest, and NYC.";

export const javascriptCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVASCRIPT + "#techarticle",
  name: `${PRODUCT_NAME} JavaScript Coverage Setup`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVASCRIPT,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "JavaScript Test Coverage", description: DESCRIPTION },
  articleSection: "JavaScript Documentation",
  genre: "Technical Documentation",
  programmingLanguage: ["JavaScript", "TypeScript"],
};

import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how to set up and configure test coverage reporting for GitAuto. Comprehensive guide for all supported languages and frameworks.";

export const coverageDocsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.OVERVIEW + "#techarticle",
  name: `${PRODUCT_NAME} Coverage Documentation`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.OVERVIEW,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Test Coverage Setup", description: DESCRIPTION },
  articleSection: "Documentation",
  genre: "Technical Documentation",
};

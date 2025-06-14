import { AUDIENCE, CREATOR } from "@/app/structured-data";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Step-by-step guide to configure test coverage reporting for Python projects and let GitAuto access it. Supports pytest, unittest, and coverage.py.";

export const pythonCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PYTHON + "#techarticle",
  name: `${PRODUCT_NAME} Python Coverage Setup`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PYTHON,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Python Test Coverage", description: DESCRIPTION },
  articleSection: "Python Documentation",
  genre: "Technical Documentation",
  programmingLanguage: "Python",
};

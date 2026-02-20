import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const pythonCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PYTHON + "#techarticle",
  name: `${PRODUCT_NAME} Python Coverage Setup`,
  headline: "Python Pytest Coverage Integration Guide",
  description: "Configure pytest and coverage.py for GitAuto automated test generation",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PYTHON,
  creator: CREATOR,
  author: {
    "@type": "Organization",
    name: "GitAuto",
  },
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.COVERAGE.PYTHON,
  keywords: ["Python testing", "pytest", "coverage.py", "LCOV"],
  programmingLanguage: "Python",
  datePublished: "2025-11-25",
  dateModified: "2025-11-25",
  offers: OFFERS,
};

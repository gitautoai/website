import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const coverageDocsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.OVERVIEW + "#techarticle",
  name: `${PRODUCT_NAME} Coverage Documentation`,
  description:
    "Setup test coverage reporting for GitAuto automated test generation. Supports JavaScript, Python, Flutter and more.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.OVERVIEW,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.COVERAGE.INDEX,
  keywords: ["test coverage", "LCOV", "automated testing", "Jest", "pytest", "Flutter"],
  programmingLanguage: ["JavaScript", "Python", "Dart"],
  offers: OFFERS,
};

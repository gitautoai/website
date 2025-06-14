import { AUDIENCE, CREATOR } from "@/app/structured-data";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Set up test coverage for Flutter and Dart projects and let GitAuto access it. Complete guide for mobile app testing automation.";

export const flutterCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.FLUTTER + "#techarticle",
  name: `${PRODUCT_NAME} Flutter Coverage Setup`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.FLUTTER,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Flutter Test Coverage", description: DESCRIPTION },
  articleSection: "Flutter Documentation",
  genre: "Technical Documentation",
  programmingLanguage: ["Dart", "Flutter"],
};

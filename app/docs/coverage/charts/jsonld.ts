import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how to use GitAuto's Coverage Charts to track test coverage improvements over time. Set realistic goals, plan your coverage journey, and celebrate success.";

export const coverageChartsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.CHARTS + "#techarticle",
  headline: `${PRODUCT_NAME} Coverage Charts Documentation`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.CHARTS,
  image: THUMBNAILS.DOCS.COVERAGE.CHARTS,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "Test Coverage Visualization",
    description: "Visual tracking of test coverage progress over time",
  },
  teaches: [
    "Understanding statement coverage",
    "Setting realistic coverage goals",
    "Planning coverage improvement strategy",
    "Using GitAuto schedule for automation",
    "Interpreting coverage trends",
    "Preparing codebase for testing",
  ],
  offers: OFFERS,
};

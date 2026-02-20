import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how to trigger GitAuto from the coverage dashboard by selecting specific files. Visual interface for targeted test generation with coverage insights.";

export const dashboardTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.DASHBOARD + "#techarticle",
  headline: `${PRODUCT_NAME} Dashboard Trigger`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.DASHBOARD,
  image: THUMBNAILS.DOCS.TRIGGERS.DASHBOARD,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "Dashboard-based Test Generation",
    description: "Visual file selection for targeted test generation",
  },
  teaches: [
    "How to access the GitAuto dashboard",
    "Selecting files with coverage data",
    "Bulk test generation workflow",
    "Coverage-driven test prioritization",
  ],
  offers: OFFERS,
};

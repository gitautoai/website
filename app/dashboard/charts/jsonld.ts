import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const chartsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.DASHBOARD.CHARTS + "#webapplication",
  name: `${PRODUCT_NAME} Coverage Charts`,
  description:
    "Visualize test coverage trends over time with interactive charts. Track progress and improvements in statement, function, and branch coverage metrics.",
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.CHARTS,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Code Coverage Analytics",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  creator: CREATOR,
  featureList: [
    "Historical coverage trend visualization",
    "Interactive time-series charts",
    "Multiple coverage metrics tracking",
    "Branch comparison analytics",
    "Progress monitoring dashboards",
    "Exportable chart data",
  ],
  applicationSuite: "GitAuto QA Automation Platform",
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.DASHBOARD.CHARTS,
    description: "GitAuto Coverage Charts interface showing historical coverage trends",
  },
  offers: OFFERS,
  audience: AUDIENCE,
  mainEntity: {
    "@type": "Dataset",
    name: "Historical Coverage Data",
    description: "Time-series data of test coverage metrics across repository history",
    variableMeasured: [
      "Statement Coverage Trends",
      "Function Coverage Trends",
      "Branch Coverage Trends",
      "Line Coverage Trends",
    ],
    measurementTechnique: "Aggregated coverage metrics over time",
  },
};

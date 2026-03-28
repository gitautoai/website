import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/WebApplication
 */
export const dashboardJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.DASHBOARD.GENERAL + "#webapplication",
  name: `${PRODUCT_NAME} Dashboard`,
  description: "Manage GitAuto dashboard: coverage trends, file coverage, triggers, rules, and integrations",
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.GENERAL,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  featureList: [
    "Coverage trends",
    "File-level coverage",
    "Account management",
    "GitHub integration",
    "Automation preferences",
    "Repository settings",
  ],
  screenshot: THUMBNAILS.DASHBOARD.GENERAL,
  offers: OFFERS,
};

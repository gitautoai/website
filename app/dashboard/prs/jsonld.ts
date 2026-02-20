import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/WebApplication
 */
export const prsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.DASHBOARD.PRS + "#webapplication",
  name: `${PRODUCT_NAME} Pull Requests Dashboard`,
  description:
    "View and manage open GitAuto pull requests. Track file changes, diff stats, and check run statuses across repositories.",
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.PRS,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Pull Request Dashboard",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  creator: CREATOR,
  featureList: [
    "View open GitAuto pull requests",
    "Track file changes and diff stats",
    "Monitor check run statuses",
    "Filter by repository",
    "Quick access to PR URLs",
    "Real-time GitHub sync",
  ],
  applicationSuite: "GitAuto QA Automation Platform",
  softwareRequirements: "GitHub repository with GitAuto installed",
  permissions: "GitHub repository access",
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.DASHBOARD.PRS,
    description: "GitAuto Pull Requests Dashboard showing open PRs with file changes and status",
  },
  offers: OFFERS,
  audience: AUDIENCE,
  usageInfo: {
    "@type": "CreativeWork",
    name: "Pull Requests Dashboard Usage",
    description:
      "View all open GitAuto pull requests with detailed file changes, additions/deletions, and CI check statuses",
  },
};

import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/WebApplication
 */
export const coverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.DASHBOARD.COVERAGE + "#webapplication",
  name: `${PRODUCT_NAME} Coverage Dashboard`,
  description:
    "View and manage test coverage for your GitHub repositories. Track statement, function, and branch coverage across files and directories.",
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.COVERAGE,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Code Coverage Dashboard",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  creator: CREATOR,
  featureList: [
    "View test coverage reports",
    "Filter by package, level, and coverage percentage",
    "Sort by different coverage metrics",
    "Create GitHub issues for low coverage files",
    "Track coverage over time",
    "Support for multiple programming languages",
  ],
  applicationSuite: "GitAuto QA Automation Platform",
  softwareRequirements: "GitHub repository with coverage reports",
  permissions: "GitHub repository access",
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.DASHBOARD.COVERAGE,
    description: "GitAuto Coverage Dashboard interface showing test coverage metrics",
  },
  offers: OFFERS,
  audience: AUDIENCE,
  usageInfo: {
    "@type": "CreativeWork",
    name: "Coverage Dashboard Usage",
    description:
      "Upload coverage reports via GitHub Actions artifacts to view detailed coverage metrics and create issues for low coverage files",
  },
  mainEntity: {
    "@type": "Dataset",
    name: "Test Coverage Data",
    description: "Aggregated test coverage metrics from GitHub Actions artifacts",
    variableMeasured: [
      "Statement Coverage",
      "Function Coverage",
      "Branch Coverage",
      "Line Coverage",
    ],
    measurementTechnique: "Static code analysis from coverage reports",
  },
};

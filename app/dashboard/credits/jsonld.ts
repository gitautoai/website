import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Manage pre-paid credits for GitAuto automated test generation. View credit balance, transaction history, configure auto-reload settings, and track PR generation costs.";
const VARIABLE_MEASURED = [
  "Credit Balance (USD)",
  "PRs Remaining",
  "Transaction Amount",
  "Transaction Type",
  "Auto-reload Threshold",
  "Auto-reload Amount",
  "Credit Expiration Date",
  "Cost Per PR",
];

/**
 * @see https://schema.org/WebApplication
 */
export const creditsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.DASHBOARD.CREDITS + "#webapplication",
  name: `${PRODUCT_NAME} Credits Dashboard`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.CREDITS,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Credit Management Dashboard",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  featureList: [
    "View current credit balance in USD",
    "Calculate PRs remaining based on balance",
    "Purchase additional credits via Stripe",
    "View complete transaction history",
    "Configure auto-reload settings",
    "Set minimum balance thresholds",
    "Track credit usage per PR",
    "Monitor credit expiration dates",
  ],
  applicationSuite: "GitAuto QA Automation Platform",
  softwareRequirements: "Active GitAuto account with Stripe integration",
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.DASHBOARD.CREDITS,
    description:
      "GitAuto Credits Dashboard showing balance, transaction history, and auto-reload settings",
  },
  offers: {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      price: "7",
      priceCurrency: "USD",
      unitText: "per PR",
      description: "Pay-as-you-go pricing at $7 per pull request generated",
      minPrice: "10",
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: 1,
        unitText: "PRs",
      },
    },
  },
  usageInfo: {
    "@type": "CreativeWork",
    name: "Credits Dashboard Usage",
    description:
      "Manage pre-paid credits for automated test generation. Credits expire after 1 year. Auto-reload prevents service interruption.",
  },
  mainEntity: {
    "@type": "Dataset",
    name: "Credit Transaction Data",
    description: "Credit purchases, usage, and balance tracking for GitAuto automation",
    variableMeasured: VARIABLE_MEASURED,
    measurementTechnique: "Real-time tracking of credit transactions and PR generation costs",
  },
};

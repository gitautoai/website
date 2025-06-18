// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { usageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Usage Dashboard - Track Your Automation Statistics & Billing`,
  description: `Monitor your GitAuto usage statistics including pull requests generated, issues processed, and billing cycle information. Track your automation activity and manage credits efficiently.`,
  url: ABSOLUTE_URLS.GITAUTO.USAGE,
  images: [{ url: THUMBNAILS.DASHBOARD.USAGE, alt: `${PRODUCT_NAME} Usage Dashboard` }],
  keywords: [
    "usage statistics dashboard",
    "GitAuto analytics",
    "billing cycle tracking",
    "automation metrics",
    "pull request statistics",
    "credit management",
  ],
});

export default function UsageDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={usageJsonLd} />
      {children}
    </>
  );
}

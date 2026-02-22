// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { usageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Usage Dashboard - Monitor Your Stats & Credits`,
  description: `Monitor GitAuto usage statistics including pull requests generated, merged PRs, and credit usage. Track automation activity.`,
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.USAGE,
  images: [{ url: THUMBNAILS.DASHBOARD.USAGE, alt: `${PRODUCT_NAME} Usage Dashboard` }],
  keywords: [
    "usage statistics dashboard",
    "GitAuto analytics",
    "monthly usage tracking",
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

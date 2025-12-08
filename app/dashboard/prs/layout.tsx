// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { prsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Pull Requests Dashboard - Track & Monitor PRs`,
  description: `View and manage open GitAuto pull requests. Track file changes, diff stats, and CI check statuses across repositories.`,
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.PRS,
  images: [{ url: THUMBNAILS.DASHBOARD.PRS, alt: `${PRODUCT_NAME} Pull Requests Dashboard` }],
  keywords: [
    "pull request dashboard",
    "GitHub PR tracking",
    "automated PR monitoring",
    "diff stats viewer",
    "CI check status",
    "GitAuto PRs",
  ],
});

export default function PRsDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={prsJsonLd} />
      {children}
    </>
  );
}

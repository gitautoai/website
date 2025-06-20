// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { coverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Coverage Dashboard - Analytics & Management`,
  description: `Monitor and improve test coverage across GitHub repositories. View detailed metrics, identify low-coverage files, create issues.`,
  url: ABSOLUTE_URLS.GITAUTO.COVERAGE,
  images: [{ url: THUMBNAILS.DASHBOARD.COVERAGE, alt: `${PRODUCT_NAME} Coverage Dashboard` }],
  keywords: [
    "test coverage dashboard",
    "code coverage analytics",
    "GitHub test coverage",
    "coverage report analysis",
    "automated testing metrics",
  ],
});

export default function CoverageDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={coverageJsonLd} />
      {children}
    </>
  );
}

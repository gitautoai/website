import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { coverageChartsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Coverage Charts - Track Test Coverage Progress`,
  description: `Learn how to use GitAuto's Coverage Charts to track test coverage improvements over time. Set goals, plan your coverage journey, and celebrate success.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.CHARTS,
  images: [{ url: THUMBNAILS.DOCS.COVERAGE.CHARTS, alt: `${PRODUCT_NAME} Coverage Charts` }],
  keywords: [
    "test coverage charts",
    "coverage tracking",
    "GitAuto charts",
    "statement coverage",
    "coverage goals",
    "test automation progress",
    "coverage improvement planning",
    "test coverage visualization",
  ],
});

export default function CoverageChartsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={coverageChartsJsonLd} />
      {children}
    </>
  );
}

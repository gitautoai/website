import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { javascriptCoverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} JavaScript / TypeScript Coverage Setup - Jest & Vitest Configuration`,
  description: `Configure JavaScript and TypeScript test coverage for GitAuto. Complete setup guide for Jest, Vitest, and GitHub Actions integration for automated test generation.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVASCRIPT,
  images: [
    { url: THUMBNAILS.DOCS.COVERAGE.JAVASCRIPT, alt: `${PRODUCT_NAME} JavaScript Coverage Setup` },
  ],
  keywords: [
    "JavaScript test coverage",
    "TypeScript test coverage",
    "Jest coverage setup",
    "Vitest coverage configuration",
    "JavaScript GitHub Actions",
    "LCOV JavaScript setup",
  ],
});

export default function JavaScriptCoverageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={javascriptCoverageJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { goCoverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Go Coverage Setup - Go Test & gcov2lcov Guide`,
  description: `Configure Go test coverage for GitAuto automation. Complete setup guide for Go's built-in testing framework and GitHub Actions integration.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.GO,
  images: [{ url: THUMBNAILS.DOCS.COVERAGE.GO, alt: `${PRODUCT_NAME} Go Coverage Setup` }],
  keywords: [
    "Go test coverage",
    "Golang testing framework",
    "go test configuration",
    "Go GitHub Actions",
    "LCOV Go setup",
    "automated Go testing",
  ],
});

export default function GoCoverageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={goCoverageJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { pythonCoverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Python Coverage Setup - pytest & coverage.py Configuration`,
  description: `Configure Python test coverage for GitAuto automation. Complete setup guide for pytest, coverage.py, and GitHub Actions integration.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PYTHON,
  images: [{ url: THUMBNAILS.DOCS.COVERAGE.PYTHON, alt: `${PRODUCT_NAME} Python Coverage Setup` }],
  keywords: [
    "Python test coverage",
    "pytest coverage setup",
    "coverage.py configuration",
    "Python GitHub Actions",
    "LCOV Python setup",
    "automated Python testing",
  ],
});

export default function PythonCoverageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={pythonCoverageJsonLd} />
      {children}
    </>
  );
}

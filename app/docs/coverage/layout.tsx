// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { coverageDocsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Coverage Documentation - Setup Guide for All Testing Frameworks`,
  description: `Configure test coverage reporting for GitAuto. Setup guides for JavaScript, TypeScript, Python, Flutter frameworks and GitHub Actions.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.OVERVIEW,
  images: [{ url: THUMBNAILS.DOCS.COVERAGE.INDEX, alt: `${PRODUCT_NAME} Coverage Documentation` }],
  keywords: [
    "test coverage documentation",
    "LCOV setup guide",
    "GitAuto coverage configuration",
    "Jest coverage setup",
    "pytest coverage configuration",
    "Flutter test coverage",
    "JavaScript testing coverage",
    "Python testing coverage",
    "automated test generation",
    "GitHub Actions coverage",
    "coverage report artifacts",
    "unit test automation",
  ],
});

export default function CoverageDocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={coverageDocsJsonLd} />
      {children}
    </>
  );
}

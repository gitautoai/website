import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { multiLanguageCoverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Multi-Language Test Coverage Configuration`,
  description: `Configure test coverage for repositories with multiple programming languages. Setup guide for PHP + JavaScript, Python + TypeScript, and other combinations.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.MULTI_LANGUAGE,
  images: [
    {
      url: THUMBNAILS.DOCS.COVERAGE.MULTI_LANGUAGE,
      alt: `${PRODUCT_NAME} Multi-Language Coverage`,
    },
  ],
  keywords: [
    "multi-language test coverage",
    "polyglot repository coverage",
    "PHP JavaScript coverage",
    "multiple LCOV reports",
    "GitHub Actions multi-language",
  ],
});

export default function MultiLanguageCoverageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={multiLanguageCoverageJsonLd} />
      {children}
    </>
  );
}

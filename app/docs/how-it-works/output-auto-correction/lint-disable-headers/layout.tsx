import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { lintDisableHeadersJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Lint Disable Headers - Auto-Add Test File Rules`,
  description:
    "Learn how GitAuto automatically adds necessary lint-disable comments to test files across TypeScript, Python, and PHP, preventing false linting failures.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINT_DISABLE_HEADERS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Lint Disable Headers`,
    },
  ],
  keywords: [
    "lint disable",
    "eslint disable",
    "pylint disable",
    "test file headers",
    "linting rules",
  ],
});

export default function LintDisableHeadersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={lintDisableHeadersJsonLd} />
      {children}
    </>
  );
}

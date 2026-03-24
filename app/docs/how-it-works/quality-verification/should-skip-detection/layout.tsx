import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { shouldSkipDetectionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Should-Skip Detection - Skip Untestable Files`,
  description:
    "Learn how GitAuto analyzes source files before test generation to skip files that don't need tests, like type definitions, constants, and import-only files.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SHOULD_SKIP_DETECTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Should-Skip Detection`,
    },
  ],
  keywords: [
    "skip detection",
    "file analysis",
    "type definitions",
    "test optimization",
    "quality verification",
  ],
});

export default function ShouldSkipDetectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={shouldSkipDetectionJsonLd} />
      {children}
    </>
  );
}

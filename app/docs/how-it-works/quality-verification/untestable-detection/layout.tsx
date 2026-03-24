import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { untestableDetectionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Untestable Detection - Identify Untestable Code`,
  description:
    "Learn how GitAuto uses the AI model to evaluate whether uncovered code is genuinely untestable or should be removed, preventing wasted iterations on unreachable code.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Untestable Detection`,
    },
  ],
  keywords: [
    "untestable code",
    "code analysis",
    "dead code",
    "coverage optimization",
    "quality verification",
  ],
});

export default function UntestableDetectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={untestableDetectionJsonLd} />
      {children}
    </>
  );
}

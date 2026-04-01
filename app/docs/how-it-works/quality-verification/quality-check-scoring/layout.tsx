import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { qualityCheckScoringJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Quality Check Scoring - Beyond Coverage Metrics`,
  description:
    "Learn how GitAuto evaluates test quality across 7 categories including adversarial, security, performance, and memory checks, using blob SHA change detection to score tests beyond coverage numbers.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECK_SCORING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Quality Check Scoring`,
    },
  ],
  keywords: [
    "test quality",
    "quality checks",
    "adversarial testing",
    "security testing",
    "blob SHA",
    "change detection",
    "quality verification",
  ],
});

export default function QualityCheckScoringLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={qualityCheckScoringJsonLd} />
      {children}
    </>
  );
}

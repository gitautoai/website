import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { qualityChecklistJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Quality Checklist - 41 Checks Across 8 Categories`,
  description:
    "The complete GitAuto quality checklist: 41 individual checks across 8 categories including business logic, adversarial, security, performance, memory, error handling, accessibility, and SEO.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECKLIST,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Quality Checklist`,
    },
  ],
  keywords: [
    "quality checklist",
    "test quality",
    "security testing",
    "adversarial testing",
    "accessibility testing",
    "performance testing",
    "quality verification",
  ],
});

export default function QualityChecklistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={qualityChecklistJsonLd} />
      {children}
    </>
  );
}

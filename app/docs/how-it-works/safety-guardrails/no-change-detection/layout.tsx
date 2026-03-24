import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { noChangeDetectionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} No-Change Detection - Empty Commit Prevention`,
  description:
    "Learn how GitAuto detects when file edits produce no actual changes and skips the commit to avoid PR noise.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.NO_CHANGE_DETECTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} No-Change Detection`,
    },
  ],
  keywords: [
    "no-change detection",
    "empty commit prevention",
    "diff comparison",
    "safety guardrails",
    "PR noise reduction",
  ],
});

export default function NoChangeDetectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={noChangeDetectionJsonLd} />
      {children}
    </>
  );
}

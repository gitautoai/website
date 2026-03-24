import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { diffHunkRepairJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Diff Hunk Repair - Auto-Fix Incorrect Line Counts`,
  description:
    "Learn how GitAuto automatically repairs incorrect line counts in unified diff hunk headers, fixing one of the most common model failure modes.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Diff Hunk Repair`,
    },
  ],
  keywords: [
    "diff hunk repair",
    "unified diff",
    "hunk header",
    "line count correction",
    "git apply",
  ],
});

export default function DiffHunkRepairLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={diffHunkRepairJsonLd} />
      {children}
    </>
  );
}

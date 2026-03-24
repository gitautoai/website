import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { diffPrefixRepairJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Diff Prefix Repair - Ensure Proper a/b Prefixes`,
  description:
    "Learn how GitAuto ensures unified diff files have proper a/ and b/ prefixes, preventing git apply rejections caused by missing prefixes.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_PREFIX_REPAIR,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Diff Prefix Repair`,
    },
  ],
  keywords: [
    "diff prefix repair",
    "unified diff",
    "a/ b/ prefixes",
    "git apply",
    "patch format",
  ],
});

export default function DiffPrefixRepairLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={diffPrefixRepairJsonLd} />
      {children}
    </>
  );
}

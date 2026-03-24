import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { lineEndingPreservationJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Line Ending Preservation - LF vs CRLF Detection`,
  description:
    "Learn how GitAuto detects and preserves the original line ending style (LF vs CRLF) of files, preventing massive diffs from line ending changes.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINE_ENDING_PRESERVATION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Line Ending Preservation`,
    },
  ],
  keywords: [
    "line endings",
    "LF vs CRLF",
    "Windows line endings",
    "cross-platform",
    "diff noise prevention",
  ],
});

export default function LineEndingPreservationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={lineEndingPreservationJsonLd} />
      {children}
    </>
  );
}

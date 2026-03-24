import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { fullFileReadsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Full File Reads - Complete File Context`,
  description:
    "Learn how GitAuto forces the model to read entire files instead of truncating, preventing broken diffs caused by missing context.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.FULL_FILE_READS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
      alt: `${PRODUCT_NAME} Full File Reads`,
    },
  ],
  keywords: [
    "full file reads",
    "file truncation",
    "context window",
    "diff accuracy",
    "AI code generation",
  ],
});

export default function FullFileReadsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={fullFileReadsJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { toolNameCorrectionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Tool Name Correction - Fix Hallucinated Tool Names`,
  description:
    "Learn how GitAuto auto-corrects when the model calls non-existent tool names by mapping hallucinated names to real tools in the agent loop.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_NAME_CORRECTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Tool Name Correction`,
    },
  ],
  keywords: [
    "tool name correction",
    "hallucinated tool names",
    "agent loop",
    "tool mapping",
    "AI error recovery",
  ],
});

export default function ToolNameCorrectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={toolNameCorrectionJsonLd} />
      {children}
    </>
  );
}

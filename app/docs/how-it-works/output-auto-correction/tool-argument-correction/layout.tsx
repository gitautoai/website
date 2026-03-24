import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { toolArgumentCorrectionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Tool Argument Correction - Match Arguments to Tools`,
  description:
    "Learn how GitAuto detects when the model passes arguments meant for one tool to another and automatically swaps the tool name to match.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Tool Argument Correction`,
    },
  ],
  keywords: [
    "tool argument correction",
    "argument mismatch",
    "tool swap",
    "agent loop",
    "AI error recovery",
  ],
});

export default function ToolArgumentCorrectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={toolArgumentCorrectionJsonLd} />
      {children}
    </>
  );
}

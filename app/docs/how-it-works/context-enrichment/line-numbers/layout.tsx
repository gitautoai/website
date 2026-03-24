import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { lineNumbersJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Line Numbers - Precise Diff Targeting`,
  description:
    "Learn how GitAuto adds right-aligned line numbers to file content, enabling the model to reference specific lines for precise diff application.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.LINE_NUMBERS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
      alt: `${PRODUCT_NAME} Line Numbers`,
    },
  ],
  keywords: [
    "line numbers",
    "code formatting",
    "diff application",
    "context enrichment",
    "AI code generation",
  ],
});

export default function LineNumbersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={lineNumbersJsonLd} />
      {children}
    </>
  );
}

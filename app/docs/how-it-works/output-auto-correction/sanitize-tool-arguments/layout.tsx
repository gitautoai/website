import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { sanitizeToolArgumentsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Sanitize Tool Arguments - Strip XML Artifacts`,
  description:
    "Learn how GitAuto strips malformed XML fragments from the model's tool arguments, preventing JSON parsing failures that crash the agent loop.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.SANITIZE_TOOL_ARGUMENTS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Sanitize Tool Arguments`,
    },
  ],
  keywords: [
    "sanitize arguments",
    "XML fragments",
    "JSON parsing",
    "agent loop",
    "tool argument cleaning",
  ],
});

export default function SanitizeToolArgumentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={sanitizeToolArgumentsJsonLd} />
      {children}
    </>
  );
}

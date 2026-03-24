import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { codingStandardsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Coding Standards - Built-in Quality Rules`,
  description:
    "Learn how GitAuto injects a comprehensive coding standards document into every model session, covering test design, code quality, and anti-pattern prevention.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CODING_STANDARDS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
      alt: `${PRODUCT_NAME} Coding Standards`,
    },
  ],
  keywords: [
    "coding standards",
    "test design principles",
    "anti-patterns",
    "code quality rules",
    "behavioral testing",
  ],
});

export default function CodingStandardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={codingStandardsJsonLd} />
      {children}
    </>
  );
}

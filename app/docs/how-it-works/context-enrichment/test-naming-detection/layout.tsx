import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { testNamingDetectionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Test Naming Detection - Consistent Conventions`,
  description:
    "Learn how GitAuto detects the dominant test naming convention in your repo and instructs the model to follow it consistently.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_NAMING_DETECTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
      alt: `${PRODUCT_NAME} Test Naming Detection`,
    },
  ],
  keywords: [
    "test naming convention",
    "naming detection",
    "test file naming",
    "spec vs test",
    "consistent naming",
  ],
});

export default function TestNamingDetectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={testNamingDetectionJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { testFilePreloadingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Test File Preloading - Learn by Example`,
  description:
    "Learn how GitAuto pre-loads up to 5 existing test files before the agent loop, teaching the model your project's testing patterns by example.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_FILE_PRELOADING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
      alt: `${PRODUCT_NAME} Test File Preloading`,
    },
  ],
  keywords: [
    "test file preloading",
    "testing patterns",
    "context enrichment",
    "test consistency",
    "AI test generation",
  ],
});

export default function TestFilePreloadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={testFilePreloadingJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { errorBaselinesJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Error Baselines - Separate New from Old Errors`,
  description:
    "Learn how GitAuto captures pre-existing errors (e.g., type errors, lint warnings) before test generation, separating new errors from old ones to avoid wasted iterations.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.ERROR_BASELINES,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
      alt: `${PRODUCT_NAME} Error Baselines`,
    },
  ],
  keywords: [
    "error baselines",
    "TypeScript errors",
    "pre-existing errors",
    "tsc noEmit",
    "AI code generation",
  ],
});

export default function ErrorBaselinesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={errorBaselinesJsonLd} />
      {children}
    </>
  );
}

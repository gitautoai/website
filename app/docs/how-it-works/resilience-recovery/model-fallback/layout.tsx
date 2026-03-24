import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { modelFallbackJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Model Fallback - Automatic Failover`,
  description:
    "Learn how GitAuto implements a model fallback chain from Claude Opus 4.6 down to Sonnet 4.0, automatically switching models when one fails.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.MODEL_FALLBACK,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY,
      alt: `${PRODUCT_NAME} Model Fallback`,
    },
  ],
  keywords: [
    "model fallback",
    "resilience",
    "AI models",
    "automatic failover",
    "AI code generation",
  ],
});

export default function ModelFallbackLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={modelFallbackJsonLd} />
      {children}
    </>
  );
}

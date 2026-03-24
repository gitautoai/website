import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { triggerSpecificPromptsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Trigger-Specific Prompts - Context-Aware Instructions`,
  description:
    "Learn how GitAuto loads different XML prompt files depending on the trigger type, providing specialized instructions for each scenario.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TRIGGER_SPECIFIC_PROMPTS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
      alt: `${PRODUCT_NAME} Trigger-Specific Prompts`,
    },
  ],
  keywords: [
    "trigger-specific prompts",
    "prompt engineering",
    "XML prompts",
    "context-aware instructions",
    "AI code generation",
  ],
});

export default function TriggerSpecificPromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdScript data={triggerSpecificPromptsJsonLd} />
      {children}
    </>
  );
}

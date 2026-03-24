import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { antiHallucinationPromptsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Anti-Hallucination Prompts - Verification Instructions`,
  description:
    "Learn how GitAuto uses system message instructions to explicitly tell the model to never claim a file exists unless verified, preventing hallucinated imports and references.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.ANTI_HALLUCINATION_PROMPTS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
      alt: `${PRODUCT_NAME} Anti-Hallucination Prompts`,
    },
  ],
  keywords: [
    "anti-hallucination",
    "system prompts",
    "file verification",
    "import validation",
    "AI code generation",
  ],
});

export default function AntiHallucinationPromptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={antiHallucinationPromptsJsonLd} />
      {children}
    </>
  );
}

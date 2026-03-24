import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { strictToolSchemasJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Strict Tool Schemas - JSON Schema Validation`,
  description:
    "Learn how GitAuto enforces strict JSON schemas on all tool definitions to prevent the model from hallucinating extra fields or using wrong types.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} Strict Tool Schemas`,
    },
  ],
  keywords: [
    "strict tool schemas",
    "JSON schema validation",
    "tool definitions",
    "safety guardrails",
    "API validation",
  ],
});

export default function StrictToolSchemasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={strictToolSchemasJsonLd} />
      {children}
    </>
  );
}

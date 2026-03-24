import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { tokenTrimmingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Token Trimming - Context Window Management`,
  description:
    "Learn how GitAuto trims old messages from the conversation to stay under the model's 200K token limit while preserving tool_use/tool_result pairs.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
      alt: `${PRODUCT_NAME} Token Trimming`,
    },
  ],
  keywords: [
    "token trimming",
    "context window",
    "token limit",
    "conversation management",
    "AI code generation",
  ],
});

export default function TokenTrimmingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={tokenTrimmingJsonLd} />
      {children}
    </>
  );
}

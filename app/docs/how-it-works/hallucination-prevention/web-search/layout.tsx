import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { webSearchJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Web Search - Real-Time Fact Checking`,
  description:
    "Learn how GitAuto provides the model with a web search tool to verify current information about libraries, GitHub Actions versions, and API usage.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.WEB_SEARCH,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
      alt: `${PRODUCT_NAME} Web Search`,
    },
  ],
  keywords: [
    "web search",
    "hallucination prevention",
    "version verification",
    "grounding",
    "AI code generation",
  ],
});

export default function WebSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={webSearchJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { webFetchSummarizationJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Web Fetch Summarization - Token Cost Optimization`,
  description:
    "Learn how GitAuto uses Claude Haiku as a summarization layer to filter web page content before passing it to the main reasoning model, reducing token costs by ~80%.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.WEB_FETCH_SUMMARIZATION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
      alt: `${PRODUCT_NAME} Web Fetch Summarization`,
    },
  ],
  keywords: [
    "token optimization",
    "cost reduction",
    "model routing",
    "Claude Haiku",
    "web fetching",
  ],
});

export default function WebFetchSummarizationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={webFetchSummarizationJsonLd} />
      {children}
    </>
  );
}

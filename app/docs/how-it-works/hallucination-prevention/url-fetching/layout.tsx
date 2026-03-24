import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { urlFetchingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} URL Fetching - Full Page Content Reading`,
  description:
    "Learn how GitAuto fetches full webpage content as markdown so the model can read documentation, API references, and changelogs before generating code.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.URL_FETCHING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
      alt: `${PRODUCT_NAME} URL Fetching`,
    },
  ],
  keywords: [
    "url fetching",
    "web scraping",
    "hallucination prevention",
    "documentation reading",
    "AI code generation",
  ],
});

export default function UrlFetchingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={urlFetchingJsonLd} />
      {children}
    </>
  );
}

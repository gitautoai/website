import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { fileQueryRoutingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} File Query Routing - Cheaper File Reads`,
  description:
    "Learn how GitAuto routes file queries through Claude Haiku so only the answer enters the main model's context, reducing input token costs for pattern learning.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.FILE_QUERY_ROUTING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
      alt: `${PRODUCT_NAME} File Query Routing`,
    },
  ],
  keywords: [
    "token optimization",
    "cost reduction",
    "model routing",
    "Claude Haiku",
    "file reading",
  ],
});

export default function FileQueryRoutingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={fileQueryRoutingJsonLd} />
      {children}
    </>
  );
}

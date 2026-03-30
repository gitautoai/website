import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { ciLogDedupJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} CI Log Deduplication - Reduce Token Costs from Duplicate Errors`,
  description:
    "Learn how GitAuto deduplicates identical CI test errors to reduce token costs. 39 identical Jest failures become one example plus a count.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CI_LOG_DEDUP,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
      alt: `${PRODUCT_NAME} CI Log Deduplication`,
    },
  ],
  keywords: [
    "CI log deduplication",
    "token cost reduction",
    "Jest errors",
    "duplicate errors",
    "LLM cost optimization",
  ],
});

export default function CiLogDedupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={ciLogDedupJsonLd} />
      {children}
    </>
  );
}

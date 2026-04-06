import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { howItWorksJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} - How It Works`,
  description:
    "Explore 50+ techniques GitAuto uses across 7 categories to generate high-quality unit tests - from context enrichment to hallucination prevention.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OVERVIEW,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.INDEX,
      alt: `${PRODUCT_NAME} How It Works`,
    },
  ],
  keywords: [
    "how GitAuto works",
    "AI test generation",
    "context enrichment",
    "hallucination prevention",
    "quality verification",
    "safety guardrails",
  ],
});

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={howItWorksJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { ciLogCleaningJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} CI Log Cleaning - Noise Reduction for AI`,
  description:
    "Learn how GitAuto cleans CI logs by removing noise, deduplicating warnings, stripping ANSI codes, and minimizing verbosity before feeding them to the model.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CI_LOG_CLEANING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
      alt: `${PRODUCT_NAME} CI Log Cleaning`,
    },
  ],
  keywords: [
    "CI log cleaning",
    "ANSI escape codes",
    "log deduplication",
    "CI/CD noise reduction",
    "token optimization",
  ],
});

export default function CiLogCleaningLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={ciLogCleaningJsonLd} />
      {children}
    </>
  );
}

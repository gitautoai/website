import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { staleFileReplacementJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Stale File Replacement - Duplicate Read Optimization`,
  description:
    "Learn how GitAuto replaces older file read contents with placeholders when the same file has been read multiple times, keeping only the most recent version.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.STALE_FILE_REPLACEMENT,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
      alt: `${PRODUCT_NAME} Stale File Replacement`,
    },
  ],
  keywords: [
    "stale file replacement",
    "token optimization",
    "file deduplication",
    "context management",
    "AI code generation",
  ],
});

export default function StaleFileReplacementLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={staleFileReplacementJsonLd} />
      {children}
    </>
  );
}

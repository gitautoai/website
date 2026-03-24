import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { outdatedDiffRemovalJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Outdated Diff Removal - Token Optimization`,
  description:
    "Learn how GitAuto removes old diff attempts for files that were edited again in later iterations, keeping only the latest apply_diff_to_file attempt per file.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.OUTDATED_DIFF_REMOVAL,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
      alt: `${PRODUCT_NAME} Outdated Diff Removal`,
    },
  ],
  keywords: [
    "outdated diff removal",
    "token optimization",
    "diff deduplication",
    "context management",
    "AI code generation",
  ],
});

export default function OutdatedDiffRemovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={outdatedDiffRemovalJsonLd} />
      {children}
    </>
  );
}

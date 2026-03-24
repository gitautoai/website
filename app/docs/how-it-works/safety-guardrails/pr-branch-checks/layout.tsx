import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { prBranchChecksJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} PR/Branch Checks - Stale Target Detection`,
  description:
    "Learn how GitAuto checks if the PR is still open and the branch still exists before each iteration to avoid wasted work.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.PR_BRANCH_CHECKS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} PR/Branch Checks`,
    },
  ],
  keywords: [
    "PR checks",
    "branch checks",
    "stale target detection",
    "safety guardrails",
    "GitHub API",
  ],
});

export default function PrBranchChecksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={prBranchChecksJsonLd} />
      {children}
    </>
  );
}

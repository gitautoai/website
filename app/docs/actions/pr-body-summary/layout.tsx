import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { prBodySummaryJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} PR Body Summary - AI Work Summaries`,
  description:
    "Learn how GitAuto uses Claude Sonnet 4.6 to summarize what it did, bugs found, and non-code tasks, and appends it to the PR body after completing work.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.PR_BODY_SUMMARY,
  images: [
    {
      url: THUMBNAILS.DOCS.ACTIONS.AUTO_MERGE,
      alt: `${PRODUCT_NAME} PR Body Summary`,
    },
  ],
  keywords: ["PR body summary", "code review", "AI agent reporting", "pull request automation"],
});

export default function PrBodySummaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={prBodySummaryJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { prMergeJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} PR Merge Trigger - Safe Automated Testing for PRs`,
  description: `Learn how to use GitAuto's PR Merge Trigger to create separate test PRs after merge. Safer than PR Change with clean separation of concerns.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.PR_MERGE,
  images: [{ url: THUMBNAILS.DOCS.TRIGGERS.PR_MERGE, alt: `${PRODUCT_NAME} PR Merge Trigger` }],
  keywords: [
    "GitAuto PR merge trigger",
    "automated testing after merge",
    "separate test PRs",
    "merge trigger setup",
    "production workflow testing",
  ],
});

export default function PRMergeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={prMergeJsonLd} />
      {children}
    </>
  );
}

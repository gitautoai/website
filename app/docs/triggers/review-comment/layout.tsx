import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { reviewCommentTriggerJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Review Comment Trigger - Collaborate with AI`,
  description: `Learn how to use review comments to request fixes on GitAuto-created PRs. Request changes just like with human team members and get automatic fix commits.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.REVIEW_COMMENT,
  images: [
    { url: THUMBNAILS.DOCS.TRIGGERS.REVIEW_COMMENT, alt: `${PRODUCT_NAME} Review Comment Trigger` },
  ],
  keywords: [
    "GitAuto review comments",
    "PR feedback",
    "test fix requests",
    "automated code fixes",
    "GitHub review workflow",
  ],
});

export default function ReviewCommentTriggerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={reviewCommentTriggerJsonLd} />
      {children}
    </>
  );
}

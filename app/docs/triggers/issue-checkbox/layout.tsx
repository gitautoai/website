import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { issueCheckboxTriggerJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Issue Checkbox Trigger - Simple Test Requests`,
  description: `Learn how to trigger GitAuto by checking a box in GitHub issues. The simplest way to request unit tests for specific files with contextual information.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.ISSUE_CHECKBOX,
  images: [
    {
      url: THUMBNAILS.DOCS.TRIGGERS.ISSUE_CHECKBOX,
      alt: `${PRODUCT_NAME} Issue Checkbox Trigger`,
    },
  ],
  keywords: [
    "GitAuto issue checkbox",
    "GitHub issue trigger",
    "simple test requests",
    "checkbox trigger",
    "contextual test generation",
  ],
});

export default function IssueCheckboxTriggerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={issueCheckboxTriggerJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { issueCheckboxTriggerJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} GitHub Issues Checkbox Trigger - Generate Tests with One Click`,
  description: `Learn how to trigger GitAuto test generation using GitHub issue checkboxes. Simple 3-step process: create issue, check GitAuto checkbox, review generated tests. Start automated testing in 2 minutes.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER,
  images: [
    {
      url: THUMBNAILS.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER,
      alt: `${PRODUCT_NAME} Issue Checkbox Trigger Guide`,
    },
  ],
  keywords: [
    "GitHub issues checkbox trigger",
    "GitAuto checkbox automation",
    "issue-based test generation",
    "GitHub issue automation",
    "one-click test generation",
    "automated testing trigger",
    "GitHub workflow automation",
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

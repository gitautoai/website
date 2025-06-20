import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { issueLabelTriggerJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} GitHub Issues Label Trigger - Automate Test Generation with Labels`,
  description: `Trigger GitAuto test generation using GitHub issue labels. Add "gitauto" label to any issue for automated testing workflows.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER,
  images: [
    {
      url: THUMBNAILS.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER,
      alt: `${PRODUCT_NAME} Issue Label Trigger Guide`,
    },
  ],
  keywords: [
    "GitHub issues label trigger",
    "gitauto label automation",
    "issue label test generation",
    "GitHub label workflow",
    "automated testing labels",
    "legacy issue automation",
    "batch test generation",
  ],
});

export default function IssueLabelTriggerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={issueLabelTriggerJsonLd} />
      {children}
    </>
  );
}

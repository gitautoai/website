import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { issueLabelTriggerJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Issue Label Trigger - API-Friendly Automation`,
  description: `Learn how to trigger GitAuto by adding the 'gitauto' label to GitHub issues. Perfect for automation workflows, APIs, and existing issue management.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.ISSUE_LABEL,
  images: [
    {
      url: THUMBNAILS.DOCS.TRIGGERS.ISSUE_LABEL,
      alt: `${PRODUCT_NAME} Issue Label Trigger`,
    },
  ],
  keywords: [
    "GitAuto issue label",
    "gitauto label trigger",
    "API automation",
    "GitHub Actions integration",
    "existing issue workflow",
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

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { prChangeJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} PR Change Trigger - Add Unit Tests to Pull Requests`,
  description: `Learn how to use GitAuto's PR Change Trigger to automatically add unit tests when PRs are created. Perfect for coverage-gated workflows.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.PR_CHANGE,
  images: [{ url: THUMBNAILS.DOCS.TRIGGERS.PR_CHANGE, alt: `${PRODUCT_NAME} PR Change Trigger` }],
  keywords: [
    "GitAuto PR change trigger",
    "automated testing on PR",
    "coverage-gated workflow",
    "PR testing automation",
    "continuous integration testing",
  ],
});

export default function PRChangeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={prChangeJsonLd} />
      {children}
    </>
  );
}

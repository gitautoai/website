import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { autoMergeBranchProtectionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Auto-Merge Configuration & Branch Protection`,
  description: `Configure GitAuto auto-merge for pull requests. Learn setup steps, conditions, and how to bypass branch protection approval requirements.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.AUTO_MERGE,
  images: [
    {
      url: THUMBNAILS.DOCS.ACTIONS.AUTO_MERGE,
      alt: `${PRODUCT_NAME} Auto-Merge Branch Protection Guide`,
    },
  ],
  keywords: [
    "auto-merge branch protection",
    "bypass approval requirements",
    "GitHub branch protection",
    "automated pull request merging",
    "GitAuto auto-merge",
    "pull request automation",
  ],
});

export default function AutoMergeBranchProtectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdScript data={autoMergeBranchProtectionJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { siblingBranchRetargetJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Sibling Branch Retarget - Safe PR Base Changes`,
  description:
    "Learn how GitAuto safely retargets PRs between sibling release branches by saving changes, resetting to the new base, and rewriting files.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.SIBLING_BRANCH_RETARGET,
  images: [
    {
      url: THUMBNAILS.DOCS.ACTIONS.AUTO_MERGE,
      alt: `${PRODUCT_NAME} Sibling Branch Retarget`,
    },
  ],
  keywords: [
    "sibling branches",
    "base branch retarget",
    "release branches",
    "PR diff explosion",
    "git reset",
  ],
});

export default function SiblingBranchRetargetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={siblingBranchRetargetJsonLd} />
      {children}
    </>
  );
}

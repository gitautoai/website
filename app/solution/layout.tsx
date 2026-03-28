import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { solutionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Solution - Full Automation From Detection to Merge`,
  description: `The complete workflow GitAuto automates: detect untested files, open PRs, write tests, run CI, fix failures, address reviews, sync branches, and merge.`,
  url: ABSOLUTE_URLS.GITAUTO.SOLUTION,
  images: [{ url: THUMBNAILS.PRICING, alt: `${PRODUCT_NAME} Solution` }],
  keywords: [
    "test automation workflow",
    "automated testing cycle",
    "CI/CD test generation",
    "continuous test improvement",
  ],
});

export default function SolutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={solutionJsonLd} />
      {children}
    </>
  );
}

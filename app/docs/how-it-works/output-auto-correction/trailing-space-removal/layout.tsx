import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { trailingSpaceRemovalJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Trailing Space Removal - Clean Whitespace Automatically`,
  description:
    "Learn how GitAuto strips trailing whitespace from every line of generated code before committing, eliminating linting warnings and diff noise.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Trailing Space Removal`,
    },
  ],
  keywords: [
    "trailing whitespace",
    "whitespace removal",
    "code formatting",
    "linting",
    "clean commits",
  ],
});

export default function TrailingSpaceRemovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={trailingSpaceRemovalJsonLd} />
      {children}
    </>
  );
}

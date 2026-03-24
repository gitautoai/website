import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { importSortingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Import Sorting - Automatic Alphabetical Ordering`,
  description:
    "Learn how GitAuto automatically sorts import statements alphabetically after code generation, preventing linting failures across Python, JavaScript, and TypeScript.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.IMPORT_SORTING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Import Sorting`,
    },
  ],
  keywords: [
    "import sorting",
    "alphabetical imports",
    "linting",
    "Python imports",
    "JavaScript imports",
  ],
});

export default function ImportSortingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={importSortingJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { snapshotAutoUpdateJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Snapshot Auto-Update - Auto-Update Jest Snapshots`,
  description:
    "Learn how GitAuto automatically updates Jest snapshots when generating tests with snapshot assertions, preventing false failures from missing snapshot files.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SNAPSHOT_AUTO_UPDATE,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Snapshot Auto-Update`,
    },
  ],
  keywords: [
    "jest snapshots",
    "snapshot testing",
    "auto-update",
    "toMatchSnapshot",
    "quality verification",
  ],
});

export default function SnapshotAutoUpdateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={snapshotAutoUpdateJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { triggersJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Triggers - Schedule, PR Change, PR Merge, and more`,
  description: `Explore GitAuto's advanced triggers: Schedule, PR Change, and PR Merge. Automate unit test generation with different workflow patterns for better coverage.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.OVERVIEW,
  images: [{ url: THUMBNAILS.DOCS.TRIGGERS.INDEX, alt: `${PRODUCT_NAME} Advanced Triggers` }],
  keywords: [
    "GitAuto triggers",
    "automated testing triggers",
    "schedule trigger",
    "PR change trigger",
    "merge trigger",
    "test automation",
  ],
});

export default function TriggersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={triggersJsonLd} />
      {children}
    </>
  );
}

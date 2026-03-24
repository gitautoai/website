import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { gitautoMdRestrictionsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} GITAUTO.md Restrictions - Memory Quality Control`,
  description:
    "Learn how GitAuto restricts what can go into GITAUTO.md: only reusable, repo-specific learnings, preventing it from becoming a dumping ground.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.GITAUTO_MD_RESTRICTIONS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
      alt: `${PRODUCT_NAME} GITAUTO.md Restrictions`,
    },
  ],
  keywords: [
    "GITAUTO.md",
    "memory restrictions",
    "coding standards",
    "knowledge management",
    "AI code generation",
  ],
});

export default function GitautoMdRestrictionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={gitautoMdRestrictionsJsonLd} />
      {children}
    </>
  );
}

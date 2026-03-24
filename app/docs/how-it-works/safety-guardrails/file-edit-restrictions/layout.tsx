import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { fileEditRestrictionsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} File Edit Restrictions - Source Code Protection`,
  description:
    "Learn how GitAuto restricts file edits to test files by default, preventing the model from modifying production source code while generating tests.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.FILE_EDIT_RESTRICTIONS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} File Edit Restrictions`,
    },
  ],
  keywords: [
    "file edit restrictions",
    "source code protection",
    "test file editing",
    "safety guardrails",
    "AI code generation",
  ],
});

export default function FileEditRestrictionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={fileEditRestrictionsJsonLd} />
      {children}
    </>
  );
}

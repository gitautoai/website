import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { typeCheckingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Type Checking - Catch Type Errors Before Commit`,
  description:
    "Learn how GitAuto runs static type checking on generated code to catch type errors before committing, saving reviewer time.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TYPE_CHECKING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Type Checking`,
    },
  ],
  keywords: ["typescript", "type checking", "tsc", "tsconfig", "quality verification"],
});

export default function TypeCheckingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={typeCheckingJsonLd} />
      {children}
    </>
  );
}

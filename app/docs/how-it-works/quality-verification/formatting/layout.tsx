import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { formattingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Formatting - Auto-Format Generated Code`,
  description:
    "Learn how GitAuto runs the project's code formatter on generated code before committing to prevent PR failures from style violations.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.FORMATTING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Formatting`,
    },
  ],
  keywords: [
    "prettier",
    "code formatting",
    "prettierrc",
    "quality verification",
    "AI code generation",
  ],
});

export default function FormattingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={formattingJsonLd} />
      {children}
    </>
  );
}

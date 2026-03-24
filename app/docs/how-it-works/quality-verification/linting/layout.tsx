import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { lintingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Linting - Auto-Fix Generated Code`,
  description:
    "Learn how GitAuto runs the project's linter with auto-fix on generated code to catch and fix lint violations before committing to the PR.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.LINTING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Linting`,
    },
  ],
  keywords: ["linting", "auto-fix", "code quality", "typed linting", "quality verification"],
});

export default function LintingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={lintingJsonLd} />
      {children}
    </>
  );
}

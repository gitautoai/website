import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { finalNewlineJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Final Newline - POSIX-Compliant File Endings`,
  description:
    "Learn how GitAuto ensures every generated file ends with exactly one newline character, following POSIX standards and preventing git diff warnings.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.FINAL_NEWLINE,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
      alt: `${PRODUCT_NAME} Final Newline`,
    },
  ],
  keywords: [
    "final newline",
    "POSIX standard",
    "EOF newline",
    "git diff warnings",
    "file formatting",
  ],
});

export default function FinalNewlineLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={finalNewlineJsonLd} />
      {children}
    </>
  );
}

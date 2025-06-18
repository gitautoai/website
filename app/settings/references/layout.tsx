import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { referencesJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Reference Settings - Configure Documentation URLs & File Paths`,
  description: `Configure reference URLs and file paths for GitAuto test generation. Add documentation URLs and important file paths to improve test quality and context.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.REFERENCES,
  images: [{ url: THUMBNAILS.SETTINGS.REFERENCES, alt: `${PRODUCT_NAME} Reference Settings` }],
  keywords: [
    "GitAuto reference settings",
    "documentation URLs",
    "file path configuration",
    "test context setup",
    "reference documentation",
  ],
});

export default function ReferencesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={referencesJsonLd} />
      {children}
    </>
  );
}

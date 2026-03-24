import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { errorFilesEditableJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Error Files Editable - Dynamic Edit Permissions`,
  description:
    "Learn how GitAuto automatically adds source files with verification errors to the edit allowlist so the agent can fix them in subsequent iterations.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.ERROR_FILES_EDITABLE,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY,
      alt: `${PRODUCT_NAME} Error Files Editable`,
    },
  ],
  keywords: [
    "error files editable",
    "edit allowlist",
    "source file fixes",
    "verification errors",
    "AI code generation",
  ],
});

export default function ErrorFilesEditableLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={errorFilesEditableJsonLd} />
      {children}
    </>
  );
}

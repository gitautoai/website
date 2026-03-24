import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto automatically adds source files with verification errors to the edit allowlist so the agent can fix them in subsequent iterations.";

export const errorFilesEditableJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.ERROR_FILES_EDITABLE + "#techarticle",
  name: `${PRODUCT_NAME} Error Files Editable`,
  headline: `${PRODUCT_NAME} Error Files Editable`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.ERROR_FILES_EDITABLE,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "error files editable",
    "edit allowlist",
    "source file fixes",
    "verification errors",
    "AI code generation",
  ],
};

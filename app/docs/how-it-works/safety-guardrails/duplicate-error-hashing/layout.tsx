import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { duplicateErrorHashingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Duplicate Error Hashing - Stuck Agent Detection`,
  description:
    "Learn how GitAuto hashes CI error logs to detect when the agent is stuck making the same failing fix repeatedly.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} Duplicate Error Hashing`,
    },
  ],
  keywords: [
    "duplicate error hashing",
    "stuck agent detection",
    "CI error logs",
    "safety guardrails",
    "error deduplication",
  ],
});

export default function DuplicateErrorHashingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={duplicateErrorHashingJsonLd} />
      {children}
    </>
  );
}

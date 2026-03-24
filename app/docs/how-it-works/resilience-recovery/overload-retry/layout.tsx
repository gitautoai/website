import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { overloadRetryJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Overload Retry - Exponential Backoff`,
  description:
    "Learn how GitAuto handles HTTP 529 (overloaded) errors with exponential backoff retry, waiting progressively longer between retries.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.OVERLOAD_RETRY,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY,
      alt: `${PRODUCT_NAME} Overload Retry`,
    },
  ],
  keywords: [
    "overload retry",
    "exponential backoff",
    "HTTP 529",
    "error handling",
    "AI code generation",
  ],
});

export default function OverloadRetryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={overloadRetryJsonLd} />
      {children}
    </>
  );
}

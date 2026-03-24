import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { infrastructureFailureDetectionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Infrastructure Failure Detection - Flaky CI Handling`,
  description:
    "Learn how GitAuto detects transient infrastructure failures like segfaults and network timeouts in CI logs and retries instead of fixing code.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} Infrastructure Failure Detection`,
    },
  ],
  keywords: [
    "infrastructure failure detection",
    "flaky CI",
    "transient failures",
    "safety guardrails",
    "CI retry",
  ],
});

export default function InfrastructureFailureDetectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdScript data={infrastructureFailureDetectionJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { webhookDeduplicationJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Webhook Deduplication - Duplicate Event Prevention`,
  description:
    "Learn how GitAuto deduplicates incoming GitHub webhook events using database unique constraints to prevent duplicate processing.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.WEBHOOK_DEDUPLICATION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} Webhook Deduplication`,
    },
  ],
  keywords: [
    "webhook deduplication",
    "duplicate events",
    "GitHub webhooks",
    "safety guardrails",
    "unique constraints",
  ],
});

export default function WebhookDeduplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={webhookDeduplicationJsonLd} />
      {children}
    </>
  );
}

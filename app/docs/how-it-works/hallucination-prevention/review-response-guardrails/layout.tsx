import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { reviewResponseGuardrailsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Review Response Guardrails - Anti-Sycophancy`,
  description:
    "Learn how GitAuto instructs the model to think critically about review comments instead of blindly agreeing, preventing sycophantic responses that break code.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.REVIEW_RESPONSE_GUARDRAILS,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
      alt: `${PRODUCT_NAME} Review Response Guardrails`,
    },
  ],
  keywords: [
    "review response",
    "sycophancy prevention",
    "critical thinking",
    "code review",
    "AI code generation",
  ],
});

export default function ReviewResponseGuardrailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={reviewResponseGuardrailsJsonLd} />
      {children}
    </>
  );
}

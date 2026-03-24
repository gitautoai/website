import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { forcedVerificationJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Forced Verification - Guaranteed Quality Checks`,
  description:
    "Learn how GitAuto forces a verification run (formatting, linting, type checking, tests) as a final step when the agent loop exhausts all iterations without completing verification.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.FORCED_VERIFICATION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY,
      alt: `${PRODUCT_NAME} Forced Verification`,
    },
  ],
  keywords: [
    "forced verification",
    "quality checks",
    "formatting",
    "linting",
    "AI code generation",
  ],
});

export default function ForcedVerificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={forcedVerificationJsonLd} />
      {children}
    </>
  );
}

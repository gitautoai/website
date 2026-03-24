import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { temperatureZeroJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Temperature Zero - Deterministic Code Generation`,
  description:
    "Learn how GitAuto uses temperature 0.0 for all LLM API calls to produce deterministic, consistent code output across every invocation.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.TEMPERATURE_ZERO,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} Temperature Zero`,
    },
  ],
  keywords: [
    "temperature zero",
    "deterministic output",
    "code generation",
    "safety guardrails",
    "AI consistency",
  ],
});

export default function TemperatureZeroLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={temperatureZeroJsonLd} />
      {children}
    </>
  );
}

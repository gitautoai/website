import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { calculatorJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} ROI Calculator - Estimate Test Automation ROI`,
  description: `Calculate how much time and money GitAuto saves. Enter your file count and coverage to see ROI instantly. $8 per PR vs hours of manual test writing.`,
  url: ABSOLUTE_URLS.GITAUTO.ROI.CALCULATOR,
  images: [{ url: THUMBNAILS.PRICING, alt: `${PRODUCT_NAME} ROI Calculator` }],
  keywords: [
    "ROI calculator",
    "test automation ROI",
    "unit test cost savings",
    "developer productivity",
    "test coverage cost",
  ],
});

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={calculatorJsonLd} />
      {children}
    </>
  );
}

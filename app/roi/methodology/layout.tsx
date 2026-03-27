import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { methodologyJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} ROI Methodology - How We Calculate Return on Investment`,
  description: `How GitAuto calculates ROI: the formula, time savings breakdown, and real-world examples for California and India engineering teams.`,
  url: ABSOLUTE_URLS.GITAUTO.ROI.METHODOLOGY,
  images: [{ url: THUMBNAILS.PRICING, alt: `${PRODUCT_NAME} ROI Methodology` }],
  keywords: [
    "ROI methodology",
    "test automation savings",
    "engineering cost savings",
    "developer productivity ROI",
  ],
});

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={methodologyJsonLd} />
      {children}
    </>
  );
}

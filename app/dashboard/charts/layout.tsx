import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { chartsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Coverage Charts - Historical Trends & Analytics`,
  description: `Visualize test coverage trends over time. Track progress with interactive charts showing statement, function, and branch coverage improvements.`,
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.CHARTS,
  images: [{ url: THUMBNAILS.DASHBOARD.CHARTS, alt: `${PRODUCT_NAME} Coverage Charts` }],
  keywords: [
    "test coverage charts",
    "coverage trends",
    "code coverage analytics",
    "test coverage history",
    "coverage improvement tracking",
  ],
});

export default function ChartsDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={chartsJsonLd} />
      {children}
    </>
  );
}

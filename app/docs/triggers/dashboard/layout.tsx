import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { dashboardTriggerJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Dashboard Trigger - Bulk unit test generation`,
  description: `Learn how to trigger GitAuto from the coverage dashboard by selecting specific files. Bulk unit test generation with coverage insights.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.DASHBOARD,
  images: [{ url: THUMBNAILS.DOCS.TRIGGERS.DASHBOARD, alt: `${PRODUCT_NAME} Dashboard Trigger` }],
  keywords: [
    "GitAuto dashboard trigger",
    "visual file selection",
    "coverage dashboard",
    "bulk test generation",
    "file coverage insights",
  ],
});

export default function DashboardTriggerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={dashboardTriggerJsonLd} />
      {children}
    </>
  );
}

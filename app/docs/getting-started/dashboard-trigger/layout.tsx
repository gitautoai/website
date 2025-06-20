import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { dashboardTriggerJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Dashboard Trigger - Visual Test Generation Interface`,
  description: `Use GitAuto dashboard to generate tests visually. Browse files, select parent issues, create bulk GitHub issues and manage automation.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER,
  images: [
    {
      url: THUMBNAILS.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER,
      alt: `${PRODUCT_NAME} Dashboard Trigger Guide`,
    },
  ],
  keywords: [
    "GitAuto dashboard trigger",
    "visual test generation",
    "dashboard interface",
    "bulk issue creation",
    "parent issue management",
    "coverage dashboard",
    "repository file browser",
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

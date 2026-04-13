// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import DashboardLayoutClient from "@/app/dashboard/components/DashboardLayoutClient";
import DashboardMenu from "@/app/dashboard/components/DashboardMenu";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { dashboardJsonLd } from "./general/jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Dashboard - Coverage, Settings & Analytics`,
  description: `Manage your GitAuto dashboard: coverage trends, file-level coverage, triggers, rules, integrations, and analytics.`,
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.GENERAL,
  images: [{ url: THUMBNAILS.DASHBOARD.GENERAL, alt: `${PRODUCT_NAME} Dashboard` }],
  keywords: [
    "GitAuto dashboard",
    "coverage trends",
    "test automation settings",
    "GitHub integration settings",
    "automation settings",
  ],
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={dashboardJsonLd} />
      <div className="min-h-screen flex">
        {/* Desktop Menu - Server-rendered for SEO */}
        <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-56 lg:bg-gray-50 lg:border-r lg:overflow-y-auto">
          <DashboardMenu />
        </div>

        {/* Client-side wrapper for auth, mobile menu, and main content */}
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </div>
    </>
  );
}

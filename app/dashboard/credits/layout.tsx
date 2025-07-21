// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { creditsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Credits Dashboard - Manage Pre-paid Balance`,
  description: `Manage GitAuto pre-paid credits, view transaction history, configure auto-reload settings, and track credit usage for automated test generation.`,
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.CREDITS,
  images: [{ url: THUMBNAILS.DASHBOARD.CREDITS, alt: `${PRODUCT_NAME} Credits Dashboard` }],
  keywords: [
    "GitAuto credits management",
    "pre-paid credits dashboard",
    "auto-reload settings",
    "credit transaction history",
    "pay-per-PR billing",
    "test automation credits",
  ],
});

export default function CreditsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={creditsJsonLd} />
      {children}
    </>
  );
}
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { scheduleJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Schedule Trigger - Automated Testing Setup`,
  description: `Learn how to use GitAuto's Schedule Trigger to automatically generate unit tests on schedule. Perfect for consistent test coverage improvements.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.SCHEDULE,
  images: [{ url: THUMBNAILS.DOCS.TRIGGERS.SCHEDULE, alt: `${PRODUCT_NAME} Schedule Trigger` }],
  keywords: [
    "GitAuto schedule trigger",
    "automated testing schedule",
    "scheduled test generation",
    "test coverage automation",
    "daily test creation",
  ],
});

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={scheduleJsonLd} />
      {children}
    </>
  );
}

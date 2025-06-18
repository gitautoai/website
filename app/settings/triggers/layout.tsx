import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { triggersJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Trigger Settings - Configure Automation Triggers`,
  description: `Configure GitAuto automation triggers. Set up review comment responses, test failure handling, commit triggers, merge triggers, and scheduled test generation.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.TRIGGERS,
  images: [{ url: THUMBNAILS.SETTINGS.TRIGGERS, alt: `${PRODUCT_NAME} Trigger Settings` }],
  keywords: [
    "GitAuto trigger settings",
    "automation triggers",
    "review comment triggers",
    "test failure handling",
    "scheduled automation",
  ],
});

export default function TriggersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={triggersJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { contactJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `Contact ${PRODUCT_NAME} Sales - Automated Testing Solutions`,
  description: `Contact GitAuto to discuss testing challenges and learn how automated unit test generation can help your team achieve higher coverage.`,
  url: ABSOLUTE_URLS.GITAUTO.CONTACT,
  images: [{ url: THUMBNAILS.CONTACT, alt: `Contact ${PRODUCT_NAME}` }],
  keywords: [
    "contact GitAuto",
    "automated testing consultation",
    "unit test generation inquiry",
    "testing solutions contact",
    "GitAuto support",
    "test coverage consultation",
    "development team automation",
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={contactJsonLd} />
      {children}
    </>
  );
}

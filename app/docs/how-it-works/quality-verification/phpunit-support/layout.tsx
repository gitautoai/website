import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { phpunitSupportJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} PHPUnit Support - PHP Test Verification`,
  description:
    "Learn how GitAuto runs PHPUnit for PHP projects as part of the quality verification pipeline, ensuring generated PHP tests are validated before committing.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.PHPUNIT_SUPPORT,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} PHPUnit Support`,
    },
  ],
  keywords: [
    "phpunit",
    "php testing",
    "test runner",
    "php",
    "quality verification",
  ],
});

export default function PhpunitSupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={phpunitSupportJsonLd} />
      {children}
    </>
  );
}

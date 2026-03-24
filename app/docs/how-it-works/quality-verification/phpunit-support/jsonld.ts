import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto runs PHPUnit for PHP projects as part of the quality verification pipeline, ensuring generated PHP tests are validated before committing.";

export const phpunitSupportJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.PHPUNIT_SUPPORT + "#techarticle",
  name: `${PRODUCT_NAME} PHPUnit Support`,
  headline: `${PRODUCT_NAME} PHPUnit Support`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.PHPUNIT_SUPPORT,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "phpunit",
    "php testing",
    "test runner",
    "php",
    "quality verification",
  ],
};

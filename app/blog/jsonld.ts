import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { KEYWORDS } from "@/config/keywords";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/Blog
 */
export const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": ABSOLUTE_URLS.GITAUTO.BLOG + "#blog",
  name: `${PRODUCT_NAME} Blog`,
  description:
    "Insights on automated testing, unit test generation, and software development best practices",
  url: ABSOLUTE_URLS.GITAUTO.BLOG,
  creator: CREATOR,
  audience: AUDIENCE,
  keywords: KEYWORDS,
};

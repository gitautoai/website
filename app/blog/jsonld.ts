import { AUDIENCE, CREATOR } from "@/app/structured-data";
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
    "Learn about automated testing, test coverage, and software quality best practices. Tips and tutorials for developers and QA engineers.",
  url: ABSOLUTE_URLS.GITAUTO.BLOG,
  publisher: CREATOR,
  inLanguage: "en",
  audience: AUDIENCE,
  keywords: KEYWORDS,
};

/**
 * Generate structured data for each blog post.
 */
export function createBlogPostStructuredData(
  title: string,
  description: string,
  slug: string,
  publishedDate: string,
  modifiedDate?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${ABSOLUTE_URLS.GITAUTO.BLOG}/${slug}#blogpost`,
    headline: title,
    description: description,
    url: `${ABSOLUTE_URLS.GITAUTO.BLOG}/${slug}`,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: CREATOR,
    publisher: CREATOR,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${ABSOLUTE_URLS.GITAUTO.BLOG}/${slug}`,
    },
    isPartOf: {
      "@type": "Blog",
      "@id": ABSOLUTE_URLS.GITAUTO.BLOG + "#blog",
    },
    inLanguage: "en",
    audience: AUDIENCE,
  };
}

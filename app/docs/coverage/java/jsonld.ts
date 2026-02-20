import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const javaCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVA + "#techarticle",
  name: `${PRODUCT_NAME} Java Coverage Setup`,
  headline: "Java JaCoCo Coverage Integration Guide",
  description: "Configure JaCoCo with Maven or Gradle for GitAuto automated test generation",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVA,
  creator: CREATOR,
  author: {
    "@type": "Organization",
    name: "GitAuto",
  },
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.COVERAGE.JAVA,
  keywords: ["Java testing", "JaCoCo", "Maven", "Gradle", "LCOV"],
  programmingLanguage: "Java",
  datePublished: "2025-11-25",
  dateModified: "2025-11-25",
  offers: OFFERS,
};

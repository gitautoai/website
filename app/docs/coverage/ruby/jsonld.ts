import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const rubyCoverageJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.RUBY + "#techarticle",
  name: `${PRODUCT_NAME} Ruby Coverage Setup`,
  headline: "Ruby RSpec Coverage Integration Guide",
  description: "Configure RSpec with SimpleCov for GitAuto automated test generation",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.RUBY,
  creator: CREATOR,
  author: {
    "@type": "Organization",
    name: "GitAuto",
  },
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.COVERAGE.RUBY,
  keywords: ["Ruby testing", "RSpec", "SimpleCov", "LCOV"],
  programmingLanguage: "Ruby",
  datePublished: "2025-11-25",
  dateModified: "2025-11-25",
  offers: OFFERS,
};

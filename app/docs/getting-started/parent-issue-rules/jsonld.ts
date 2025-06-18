import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const parentIssueRulesJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES + "#techarticle",
  name: `${PRODUCT_NAME} Parent Issue Rules Guide`,
  description:
    "Define consistent test generation standards using parent issue rules. Ensure quality and consistency across all automated test generation.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES,
  keywords: ["parent issue rules", "test standards", "code quality", "automated testing"],
  articleSection: "Documentation",
  offers: OFFERS,
};

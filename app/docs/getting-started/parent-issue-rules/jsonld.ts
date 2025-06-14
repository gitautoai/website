import { AUDIENCE, CREATOR } from "@/app/structured-data";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure parent issue rules for GitAuto to organize and manage test generation workflows efficiently.";

export const parentIssueRulesJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES + "#techarticle",
  name: `${PRODUCT_NAME} Parent Issue Rules`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Parent Issue Configuration", description: DESCRIPTION },
  articleSection: "Configuration Documentation",
  genre: "Technical Documentation",
};

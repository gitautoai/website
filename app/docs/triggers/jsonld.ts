import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Comprehensive guide to GitAuto's advanced triggers: Schedule, PR Change, and PR Merge triggers. Learn how to automate unit test generation.";

export const triggersJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.OVERVIEW + "#techarticle",
  name: `${PRODUCT_NAME} Advanced Triggers Documentation`,
  headline: "Advanced Triggers - Automated Testing Triggers",
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.OVERVIEW,
  author: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    applicationCategory: "DeveloperApplication",
  },
  teaches: [
    "Overview of advanced triggers",
    "Schedule trigger benefits",
    "PR Change vs PR Merge comparison",
    "Plan requirements and setup",
  ],
  image: THUMBNAILS.DOCS.TRIGGERS.INDEX,
  publisher: CREATOR,
  offers: OFFERS,
};

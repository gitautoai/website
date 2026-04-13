import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Complete documentation for GitAuto - installation, triggers, coverage setup, customization, integrations, and how it works.";

export const docsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.INDEX + "#techarticle",
  name: `${PRODUCT_NAME} Documentation`,
  headline: "GitAuto Documentation - Setup, Triggers, Coverage & More",
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.INDEX,
  author: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    applicationCategory: "DeveloperApplication",
  },
  image: THUMBNAILS.DOCS.INDEX,
  publisher: CREATOR,
  offers: OFFERS,
};

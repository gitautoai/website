import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure GitAuto's Schedule Trigger to automatically generate unit tests on schedule. Prioritizes lowest coverage files.";

export const scheduleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.SCHEDULE + "#techarticle",
  name: `${PRODUCT_NAME} Schedule Trigger Documentation`,
  headline: "Schedule Trigger - Automated Testing on Schedule",
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.SCHEDULE,
  author: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    applicationCategory: "DeveloperApplication",
  },
  teaches: [
    "How to configure Schedule Trigger",
    "File prioritization algorithm",
    "Schedule configuration options",
    "Cost-benefit analysis",
  ],
  image: THUMBNAILS.DOCS.TRIGGERS.SCHEDULE,
  publisher: CREATOR,
  offers: OFFERS,
};

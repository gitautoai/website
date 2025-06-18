import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const issueLabelTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER + "#howto",
  name: `How to Use ${PRODUCT_NAME} GitHub Issue Labels`,
  description:
    "Trigger automated test generation by adding 'gitauto' label to GitHub issues. Perfect for existing issues and automation workflows.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER,
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      name: "Find GitHub issue",
      text: "Navigate to existing or create new issue",
    },
    {
      "@type": "HowToStep",
      name: "Add gitauto label",
      text: "Add 'gitauto' label to trigger automation",
    },
    { "@type": "HowToStep", name: "GitAuto responds", text: "GitAuto analyzes issue and responds" },
    { "@type": "HowToStep", name: "Review pull request", text: "Review and merge generated tests" },
  ],
  offers: OFFERS,
};

import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const dashboardTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER + "#howto",
  name: `How to Use ${PRODUCT_NAME} Dashboard for Test Generation`,
  description:
    "Generate tests using GitAuto's visual dashboard interface. Select files, create issues, and manage automated test generation through a web interface.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER,
  totalTime: "PT10M",
  step: [
    {
      "@type": "HowToStep",
      name: "Sign in to GitAuto dashboard",
      text: "Sign in with GitHub account",
    },
    { "@type": "HowToStep", name: "Select repository", text: "Choose organization and repository" },
    { "@type": "HowToStep", name: "Select files", text: "Choose files for test generation" },
    {
      "@type": "HowToStep",
      name: "Create issues",
      text: "Generate GitHub issues for selected files",
    },
    {
      "@type": "HowToStep",
      name: "Assign to GitAuto",
      text: "Assign issues to GitAuto for automation",
    },
  ],
  offers: OFFERS,
};

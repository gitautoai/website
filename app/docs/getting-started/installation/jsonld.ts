import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const installationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.INSTALLATION + "#howto",
  name: `How to Install ${PRODUCT_NAME} GitHub App`,
  description:
    "Install GitAuto GitHub App for automated test generation. Complete setup in 5 minutes.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.INSTALLATION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.GETTING_STARTED.INSTALLATION,
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      name: "Install GitHub App",
      text: "Install GitAuto from GitHub Marketplace",
    },
    {
      "@type": "HowToStep",
      name: "Configure access",
      text: "Select repositories for GitAuto access",
    },
  ],
  offers: OFFERS,
};

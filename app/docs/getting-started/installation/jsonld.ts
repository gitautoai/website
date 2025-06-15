import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Step-by-step installation guide for GitAuto. Get started with automated unit testing in minutes.";

export const installationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.INSTALLATION + "#howto",
  name: `How to Install ${PRODUCT_NAME}`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.INSTALLATION,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "GitAuto Installation", description: DESCRIPTION },
  totalTime: "PT5M",
  supply: ["GitHub Account", "Repository Access"],
  tool: ["GitHub App", "Web Browser"],
};

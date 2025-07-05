import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto automatically analyzes test failures and creates fix commits for failed CI/CD workflows on GitAuto-created pull requests.";

export const testFailureTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.TEST_FAILURE + "#techarticle",
  headline: `${PRODUCT_NAME} Test Failure Trigger`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.TEST_FAILURE,
  image: THUMBNAILS.DOCS.TRIGGERS.TEST_FAILURE,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "Automated Test Failure Recovery",
    description: "Automatic analysis and fixing of CI/CD test failures",
  },
  teaches: [
    "How to enable test failure triggers",
    "Understanding automatic error analysis",
    "Managing workflow cancellation",
    "Using safety controls for automation",
  ],
  offers: OFFERS,
};

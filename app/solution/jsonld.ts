import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const solutionJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.SOLUTION + "#webpage",
  name: `${PRODUCT_NAME} Solution`,
  description:
    "The complete workflow GitAuto automates: detect untested files, write tests, open PRs, run CI, fix failures, address reviews, and iterate daily.",
  url: ABSOLUTE_URLS.GITAUTO.SOLUTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.PRICING,
};

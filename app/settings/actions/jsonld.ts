import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure how GitAuto handles pull requests after creation. Set up auto-merge behavior, choose merge methods (merge, squash, rebase), and control PR automation settings.";

export const actionsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.ACTIONS + "#webapplication",
  name: `${PRODUCT_NAME} Action Settings`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.ACTIONS,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  featureList: [
    "Auto-merge configuration",
    "Merge method selection",
    "Test file only auto-merge",
    "PR action automation",
  ],
  screenshot: THUMBNAILS.SETTINGS.ACTIONS,
  offers: OFFERS,
};

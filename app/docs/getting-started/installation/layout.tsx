// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { installationJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Installation Guide - Quick Setup in 5 Minutes`,
  description: `Complete step-by-step installation guide for GitAuto. Learn how to install the GitHub App, configure repository access, and start automating unit test generation in just 5 minutes.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.INSTALLATION,
  images: [
    {
      url: THUMBNAILS.DOCS.GETTING_STARTED.INSTALLATION,
      alt: `${PRODUCT_NAME} Installation Guide`,
    },
  ],
  keywords: [
    "GitAuto installation guide",
    "GitHub App setup tutorial",
    "automated testing installation",
    "unit test automation setup",
    "repository configuration guide",
    "GitHub marketplace installation",
    "CI/CD integration setup",
    "test generation installation",
    "developer tools setup",
    "QA automation installation",
    "getting started with GitAuto",
    "quick setup guide",
  ],
});

export default function InstallationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={installationJsonLd} />
      {children}
    </>
  );
}

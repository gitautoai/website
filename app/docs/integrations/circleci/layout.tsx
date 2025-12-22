import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { circleCIIntegrationJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} CircleCI Integration - Build Log Access Guide`,
  description: `Configure CircleCI tokens in GitAuto to automatically read build logs when tests fail. Setup guide for CI/CD log analysis and issue fixing.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.INTEGRATIONS.CIRCLECI,
  images: [
    {
      url: THUMBNAILS.DOCS.INTEGRATIONS.CIRCLECI,
      alt: `${PRODUCT_NAME} CircleCI Integration Configuration Guide`,
    },
  ],
  keywords: [
    "GitAuto CircleCI integration",
    "build log access",
    "CircleCI token setup",
    "CI/CD integration",
    "test failure analysis",
    "automated issue fixing",
    "GitAuto integrations",
    "CircleCI security setup",
  ],
});

export default function CircleCIIntegrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={circleCIIntegrationJsonLd} />
      {children}
    </>
  );
}

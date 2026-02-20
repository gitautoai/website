// Local imports
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { circleCIJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `Configure CircleCI Integration for ${PRODUCT_NAME} Testing`,
  description: `Connect CircleCI with GitAuto to automatically read build logs and error messages when tests fail. Configure Personal Access Tokens for CI/CD integration.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.CIRCLECI,
  images: [
    { url: THUMBNAILS.SETTINGS.INTEGRATIONS.CIRCLECI, alt: `${PRODUCT_NAME} CircleCI Integration` },
  ],
  keywords: [
    "CircleCI integration",
    "GitAuto CI/CD",
    "CircleCI personal access token",
    "test automation CI",
    "build log analysis",
    "test failure debugging",
    "continuous integration",
    "automated test generation",
  ],
});

export default function CircleCILayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={circleCIJsonLd} />
      {children}
    </>
  );
}

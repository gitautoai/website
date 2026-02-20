import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { npmIntegrationJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} npm Integration - Private Package Access Guide`,
  description: `Configure npm tokens in GitAuto to access private packages during test generation. Setup guide for ESLint, Prettier, and TypeScript.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.INTEGRATIONS.NPM,
  images: [
    {
      url: THUMBNAILS.DOCS.INTEGRATIONS.NPM,
      alt: `${PRODUCT_NAME} npm Integration Configuration Guide`,
    },
  ],
  keywords: [
    "GitAuto npm integration",
    "private package access",
    "npm token setup",
    "package registry authentication",
    "test generation with private packages",
    "automated testing configuration",
    "GitAuto integrations",
    "npm security setup",
  ],
});

export default function NpmIntegrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={npmIntegrationJsonLd} />
      {children}
    </>
  );
}

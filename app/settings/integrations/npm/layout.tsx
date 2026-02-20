import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { npmJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `Configure npm Integration for ${PRODUCT_NAME} Automated Testing`,
  description: `Connect npm with GitAuto to access private packages during test generation. Configure Access Tokens for seamless package installation.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.NPM,
  images: [{ url: THUMBNAILS.SETTINGS.INTEGRATIONS.NPM, alt: `${PRODUCT_NAME} npm Integration` }],
  keywords: [
    "npm integration",
    "GitAuto packages",
    "npm access token",
    "private package access",
    "package registry",
    "test automation",
    "node package manager",
    "automated test generation",
  ],
});

export default function NpmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={npmJsonLd} />
      {children}
    </>
  );
}

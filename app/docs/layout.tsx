import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import DocsLayoutClient from "./components/DocsLayoutClient";
import { docsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Documentation - Setup, Triggers, Coverage & More`,
  description:
    "Complete documentation for GitAuto - installation, triggers, coverage setup, customization, integrations, and how it works.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.INDEX,
  images: [{ url: THUMBNAILS.DOCS.INDEX, alt: `${PRODUCT_NAME} Documentation` }],
  keywords: [
    "GitAuto documentation",
    "test automation setup",
    "coverage configuration",
    "GitHub integration docs",
    "automated testing guide",
  ],
});

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={docsJsonLd} />
      <DocsLayoutClient>{children}</DocsLayoutClient>
    </>
  );
}

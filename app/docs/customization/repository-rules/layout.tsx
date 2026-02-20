import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { rulesJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Repository Rules Configuration - Complete Guide`,
  description: `Master GitAuto repository rules configuration for consistent test generation. Learn repository rules, defaults, and best practices with examples.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
  images: [
    {
      url: THUMBNAILS.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
      alt: `${PRODUCT_NAME} Repository Rules Configuration Guide`,
    },
  ],
  keywords: [
    "GitAuto repository rules configuration",
    "test generation standards",
    "coding rules setup",
    "repository rules guide",
    "structured rules documentation",
    "automated testing configuration",
    "GitAuto customization",
    "test generation best practices",
  ],
});

export default function RulesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={rulesJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { rulesJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Rules Settings - Configure Test Generation Rules`,
  description: `Configure custom rules for GitAuto test generation. Define repository-specific coding standards, testing patterns, and guidelines for consistent automated test creation.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES,
  images: [{ url: THUMBNAILS.SETTINGS.RULES, alt: `${PRODUCT_NAME} Rules Settings` }],
  keywords: [
    "GitAuto rules settings",
    "test generation rules",
    "coding standards configuration",
    "repository rules",
    "automated testing guidelines",
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

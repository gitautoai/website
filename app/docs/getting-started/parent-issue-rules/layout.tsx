import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { parentIssueRulesJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Parent Issue Rules - Define Test Generation Standards`,
  description: `Write effective parent issue rules for consistent GitAuto test generation. Define coding standards, file paths, and testing guidelines.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES,
  images: [
    {
      url: THUMBNAILS.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES,
      alt: `${PRODUCT_NAME} Parent Issue Rules Guide`,
    },
  ],
  keywords: [
    "parent issue rules",
    "test generation standards",
    "GitAuto coding guidelines",
    "consistent test quality",
    "test template rules",
    "automated testing standards",
  ],
});

export default function ParentIssueRulesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={parentIssueRulesJsonLd} />
      {children}
    </>
  );
}

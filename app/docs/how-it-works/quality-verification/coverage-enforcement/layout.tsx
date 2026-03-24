import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { coverageEnforcementJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Coverage Enforcement - Enforce 100% Test Coverage`,
  description:
    "Learn how GitAuto enforces 100% coverage targets for new test files, posting coverage comments on PRs and flagging uncovered lines for the agent to address.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Coverage Enforcement`,
    },
  ],
  keywords: [
    "code coverage",
    "coverage enforcement",
    "test quality",
    "coverage report",
    "quality verification",
  ],
});

export default function CoverageEnforcementLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={coverageEnforcementJsonLd} />
      {children}
    </>
  );
}

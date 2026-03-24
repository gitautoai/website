import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { testExecutionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Test Execution - Run Tests Before Commit`,
  description:
    "Learn how GitAuto runs generated tests before committing to verify they actually pass, collecting coverage data in the process.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TEST_EXECUTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Test Execution`,
    },
  ],
  keywords: [
    "jest",
    "vitest",
    "test execution",
    "test runner",
    "quality verification",
  ],
});

export default function TestExecutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={testExecutionJsonLd} />
      {children}
    </>
  );
}

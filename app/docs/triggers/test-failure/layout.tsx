import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { testFailureTriggerJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Test Failure Trigger - Automatic CI/CD Fix`,
  description: `Learn how GitAuto automatically analyzes test failures and creates fix commits for failed CI/CD workflows on GitAuto-created pull requests.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.TEST_FAILURE,
  images: [
    { url: THUMBNAILS.DOCS.TRIGGERS.TEST_FAILURE, alt: `${PRODUCT_NAME} Test Failure Trigger` },
  ],
  keywords: [
    "GitAuto test failure",
    "CI/CD fix automation",
    "automatic error analysis",
    "test failure recovery",
    "workflow error handling",
  ],
});

export default function TestFailureTriggerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={testFailureTriggerJsonLd} />
      {children}
    </>
  );
}

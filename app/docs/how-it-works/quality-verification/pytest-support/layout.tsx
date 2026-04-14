import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { pytestSupportJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} pytest Support - Python Test Verification & Caching`,
  description:
    "Learn how GitAuto runs pytest for Python projects as part of quality verification, with package manager detection for pip, poetry, and pipenv.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.PYTEST_SUPPORT,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} pytest Support`,
    },
  ],
  keywords: ["pytest", "python testing", "test runner", "python", "quality verification"],
});

export default function PytestSupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={pytestSupportJsonLd} />
      {children}
    </>
  );
}

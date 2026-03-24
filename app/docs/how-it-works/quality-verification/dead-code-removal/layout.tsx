import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { deadCodeRemovalJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Dead Code Removal - Remove Unreachable Code`,
  description:
    "Learn how GitAuto detects and removes unreachable code via ESLint typed linting, improving coverage without writing fake tests for dead branches.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
      alt: `${PRODUCT_NAME} Dead Code Removal`,
    },
  ],
  keywords: [
    "dead code",
    "unreachable code",
    "code removal",
    "typed linting",
    "quality verification",
  ],
});

export default function DeadCodeRemovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={deadCodeRemovalJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { phpCoverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} PHP Coverage Setup - PHPUnit & Xdebug Guide`,
  description: `Configure PHP test coverage for GitAuto automation. Complete setup guide for PHPUnit, Xdebug, and GitHub Actions integration.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PHP,
  images: [{ url: THUMBNAILS.DOCS.COVERAGE.PHP, alt: `${PRODUCT_NAME} PHP Coverage Setup` }],
  keywords: [
    "PHP test coverage",
    "PHPUnit coverage setup",
    "Xdebug configuration",
    "PHP GitHub Actions",
    "LCOV PHP setup",
    "automated PHP testing",
  ],
});

export default function PHPCoverageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={phpCoverageJsonLd} />
      {children}
    </>
  );
}

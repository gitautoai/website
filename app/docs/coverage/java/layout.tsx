import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { javaCoverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Java Coverage Setup - JaCoCo & Maven/Gradle`,
  description: `Configure Java test coverage for GitAuto automation. Complete setup guide for JaCoCo, Maven, Gradle, and GitHub Actions integration.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVA,
  images: [{ url: THUMBNAILS.DOCS.COVERAGE.JAVA, alt: `${PRODUCT_NAME} Java Coverage Setup` }],
  keywords: [
    "Java test coverage",
    "JaCoCo coverage setup",
    "Maven configuration",
    "Gradle configuration",
    "Java GitHub Actions",
    "LCOV Java setup",
  ],
});

export default function JavaCoverageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={javaCoverageJsonLd} />
      {children}
    </>
  );
}

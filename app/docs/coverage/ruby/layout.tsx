import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { rubyCoverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Ruby Coverage Setup - RSpec & SimpleCov Guide`,
  description: `Configure Ruby test coverage for GitAuto automation. Complete setup guide for RSpec, SimpleCov, and GitHub Actions integration.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.RUBY,
  images: [{ url: THUMBNAILS.DOCS.COVERAGE.RUBY, alt: `${PRODUCT_NAME} Ruby Coverage Setup` }],
  keywords: [
    "Ruby test coverage",
    "RSpec coverage setup",
    "SimpleCov configuration",
    "Ruby GitHub Actions",
    "LCOV Ruby setup",
    "automated Ruby testing",
  ],
});

export default function RubyCoverageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={rubyCoverageJsonLd} />
      {children}
    </>
  );
}

import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { flutterCoverageJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Flutter Coverage Setup - Flutter Test Configuration`,
  description: `Configure Flutter test coverage for GitAuto automation. Complete setup guide for Flutter's built-in testing framework and GitHub Actions integration.`,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.FLUTTER,
  images: [
    { url: THUMBNAILS.DOCS.COVERAGE.FLUTTER, alt: `${PRODUCT_NAME} Flutter Coverage Setup` },
  ],
  keywords: [
    "Flutter test coverage",
    "Flutter testing framework",
    "Dart test coverage",
    "Flutter GitHub Actions",
    "LCOV Flutter setup",
    "automated Flutter testing",
  ],
});

export default function FlutterCoverageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={flutterCoverageJsonLd} />
      {children}
    </>
  );
}

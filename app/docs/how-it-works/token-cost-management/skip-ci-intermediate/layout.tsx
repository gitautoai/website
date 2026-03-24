import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { skipCiIntermediateJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Skip CI Intermediate - CI Cost Optimization`,
  description:
    "Learn how GitAuto adds [skip ci] to intermediate commit messages to prevent CI from running on every commit during an agent session.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.SKIP_CI_INTERMEDIATE,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
      alt: `${PRODUCT_NAME} Skip CI Intermediate`,
    },
  ],
  keywords: [
    "skip ci",
    "CI optimization",
    "intermediate commits",
    "cost reduction",
    "AI code generation",
  ],
});

export default function SkipCiIntermediateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={skipCiIntermediateJsonLd} />
      {children}
    </>
  );
}

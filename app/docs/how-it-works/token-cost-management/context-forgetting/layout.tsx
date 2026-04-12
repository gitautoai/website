import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { contextForgettingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Context Forgetting - Agent-Controlled Memory`,
  description:
    "Learn how GitAuto gives the AI agent a forget_messages tool to explicitly drop stale file contents from its own context window, reducing accumulated input token costs across long runs.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CONTEXT_FORGETTING,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
      alt: `${PRODUCT_NAME} Context Forgetting`,
    },
  ],
  keywords: [
    "context window",
    "token optimization",
    "cost reduction",
    "AI agents",
    "memory management",
  ],
});

export default function ContextForgettingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={contextForgettingJsonLd} />
      {children}
    </>
  );
}

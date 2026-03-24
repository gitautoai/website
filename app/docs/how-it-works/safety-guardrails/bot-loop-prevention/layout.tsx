import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { botLoopPreventionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Bot Loop Prevention - Review Thread Guard`,
  description:
    "Learn how GitAuto prevents infinite bot-to-bot conversation loops by checking if it already replied in a review thread.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} Bot Loop Prevention`,
    },
  ],
  keywords: [
    "bot loop prevention",
    "review thread",
    "infinite loop",
    "safety guardrails",
    "bot interaction",
  ],
});

export default function BotLoopPreventionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={botLoopPreventionJsonLd} />
      {children}
    </>
  );
}

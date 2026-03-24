import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { raceConditionPreventionJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Race Condition Prevention - Database Locking`,
  description:
    "Learn how GitAuto uses database inserts as locks to prevent multiple Lambda invocations from processing the same check suite.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION,
  images: [
    {
      url: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
      alt: `${PRODUCT_NAME} Race Condition Prevention`,
    },
  ],
  keywords: [
    "race condition prevention",
    "database locking",
    "concurrent processing",
    "safety guardrails",
    "webhook deduplication",
  ],
});

export default function RaceConditionPreventionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={raceConditionPreventionJsonLd} />
      {children}
    </>
  );
}

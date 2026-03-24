import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function WebhookDeduplicationPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.WEBHOOK_DEDUPLICATION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Webhook Deduplication</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto deduplicates incoming webhook events by inserting a unique record into the
            database for each event. Duplicate webhooks - the same event delivered twice by GitHub -
            are caught by the database unique constraint and discarded.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            GitHub occasionally delivers the same webhook event multiple times due to network
            retries, timeouts, or internal queueing issues. Without deduplication, the same fix
            attempt runs multiple times in parallel, creating duplicate commits, conflicting
            branches, or wasted Lambda invocations that all do the same work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Each incoming webhook includes a unique delivery ID from GitHub. GitAuto attempts to
            insert this ID into a database table with a unique constraint. If the insert succeeds,
            the webhook is new and processing continues. If the insert fails due to a uniqueness
            violation, the webhook is a duplicate and is immediately discarded. This check happens
            before any expensive operations like cloning repositories or calling the LLM API.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION}
                className="text-pink-600 hover:underline"
              >
                Race Condition Prevention
              </Link>{" "}
              - deduplicates at the check-suite level for a different type of duplicate
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION}
                className="text-pink-600 hover:underline"
              >
                Bot Loop Prevention
              </Link>{" "}
              - prevents duplicate responses in review threads
            </li>
          </ul>
        </section>
      </div>

      <DocsContact />

      <DocsNavigation
        previousLink={prev ? { href: prev.href, title: prev.title } : undefined}
        nextLink={next ? { href: next.href, title: next.title } : undefined}
      />
    </>
  );
}

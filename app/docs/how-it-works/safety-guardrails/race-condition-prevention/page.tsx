import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function RaceConditionPreventionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Race Condition Prevention</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto uses a database insert (insert_check_suite) as a lock to prevent multiple Lambda
            invocations from processing the same check suite simultaneously. Only the first
            insertion succeeds; subsequent attempts see the existing record and bail out.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            GitHub sends multiple webhook events for the same test failure - a check_suite event, a
            check_run event, and sometimes status events. Each event triggers a separate Lambda
            invocation. Without deduplication at the check-suite level, two or more agents work on
            the same fix simultaneously, creating conflicting commits that corrupt the branch.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When a Lambda invocation starts processing a check suite, it attempts to insert a record
            into the database with the check suite ID as a unique key. The database enforces
            uniqueness - if the record already exists, the insert fails. The first Lambda to insert
            successfully proceeds with processing. All subsequent Lambdas that receive the same
            check suite ID detect the existing record and exit immediately, logging that another
            invocation is already handling it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.WEBHOOK_DEDUPLICATION}
                className="text-pink-600 hover:underline"
              >
                Webhook Deduplication
              </Link>{" "}
              - deduplicates at the webhook event level before check-suite processing
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION}
                className="text-pink-600 hover:underline"
              >
                Bot Loop Prevention
              </Link>{" "}
              - prevents another form of duplicate processing from bot interactions
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

import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function BotLoopPreventionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Bot Loop Prevention</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            Before processing a review comment, GitAuto checks whether it has already replied in
            that review thread. If it has already responded, it skips processing entirely to prevent
            infinite bot-to-bot conversation loops.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            If another bot (like a linter bot or review bot) leaves a review comment on a GitAuto
            PR, GitAuto responds to it. If the other bot then responds to GitAuto&apos;s reply, and
            GitAuto responds again, an infinite loop forms. Each response burns API tokens and
            credits, and the PR&apos;s conversation thread becomes an unreadable wall of bot
            messages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When GitAuto receives a review comment webhook, it fetches the existing comments in that
            review thread from the GitHub API. It checks whether any of the existing replies were
            authored by the GitAuto bot account. If GitAuto has already replied in that thread, the
            webhook is acknowledged but no processing occurs. This ensures GitAuto responds at most
            once per review thread, breaking any potential loop.
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
              - prevents duplicate processing of the same webhook event
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION}
                className="text-pink-600 hover:underline"
              >
                Race Condition Prevention
              </Link>{" "}
              - prevents duplicate processing at the check-suite level
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

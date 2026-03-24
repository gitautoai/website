import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function TokenTrimmingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Token Trimming</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto keeps as much conversation context as possible while staying under the
            model&apos;s 200K token limit. Rather than aggressively compacting or summarizing (which
            loses detail and causes the model to forget what it was doing), GitAuto only trims the
            oldest messages when necessary, preserves tool_use/tool_result pairs (never orphans one
            without the other), and always keeps the system message intact.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            When a model loses context, it forgets what files it read, what changes it already made,
            and what approach it was taking. It starts repeating work, making contradictory edits,
            or re-reading files it already processed. Aggressive summarization (like Claude
            Code&apos;s compact conversation) strips away details the model needs to stay coherent
            across a long session. GitAuto takes the opposite approach: keep everything, and only
            trim when the context window physically cannot fit more.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Exhaust Context Windows</h2>
          <p className="text-gray-600 mb-4">
            Models have fixed context limits but no awareness of how full their context is. Each
            file read, tool call, and response adds tokens, but the model never thinks
            &quot;I&apos;m running low on context.&quot; It will keep reading files and generating
            code until the API rejects the request for exceeding the limit. Context management must
            happen at the application layer because the model has no self-monitoring capability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before each API call, GitAuto calculates the total token count of all messages. If the
            count exceeds the usable budget, it removes only the oldest non-system messages - just
            enough to fit. When it encounters a tool_use message, it also removes the corresponding
            tool_result (and vice versa) to prevent the model from seeing an orphaned tool call
            without its response. The system message is never removed, ensuring the model always has
            the project context, coding standards, and instructions. The goal is maximum context
            retention, not minimum token usage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.OUTDATED_DIFF_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Outdated Diff Removal
              </Link>{" "}
              - removes superseded diffs to free token space
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.STALE_FILE_REPLACEMENT}
                className="text-pink-600 hover:underline"
              >
                Stale File Replacement
              </Link>{" "}
              - replaces duplicate file reads with placeholders
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

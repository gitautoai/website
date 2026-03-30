import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function CiLogDedupPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CI_LOG_DEDUP,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">CI Log Deduplication</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            When a CI run fails, the error log is included in every API call so the model always has
            the failure context. If the log contains duplicate errors (e.g., 39 test files all
            failing with the same TypeError), those duplicates multiply token costs across every
            iteration. GitAuto deduplicates identical errors before sending them to the model and
            saves oversized logs to disk for on-demand reading.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Jest and similar test runners execute each test file independently. When a shared module
            has an error, every test file that imports it produces an identical failure with the same
            stack trace. A repo with 39 test files importing one broken module generates 39 copies
            of the same error. Our log cleaning pipeline already stripped ANSI codes, removed
            node_modules from stack traces, and extracted the Jest summary section, but it treated
            each copy as unique. The result: a 390K character log embedded in every API call, costing
            hundreds of dollars on a single PR.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            The deduplication pipeline has three stages, each in its own module:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2 mb-4">
            <li>
              <strong>Extract Jest summary section</strong> - pulls out the &quot;Summary of all
              failing tests&quot; block and header commands, discarding verbose per-test output
            </li>
            <li>
              <strong>Strip node_modules from stack traces</strong> - removes internal framework
              lines that add characters without useful information
            </li>
            <li>
              <strong>Deduplicate identical errors</strong> - groups failures by their error message
              and stack trace content. When multiple test files produce the same error, only one
              example is kept with a count (e.g., &quot;39 tests failed with this same error&quot;)
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            For logs that are still large after cleaning (over 50K characters), the full log is saved
            to a file in the cloned repository. A 5K character preview is included in the initial
            message with a pointer to the full file. The agent can then read or search the file
            on demand instead of carrying the entire log in every API call.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Impact</h2>
          <p className="text-gray-600 mb-4">
            In the case that triggered this feature, 39 identical Jest TypeErrors inflated a CI log
            to 390K characters (roughly 100K tokens). After deduplication, the same log is under 10K
            characters. Over 8 retry iterations, this saves millions of input tokens per PR.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CI_LOG_CLEANING}
                className="text-pink-600 hover:underline"
              >
                CI Log Cleaning
              </Link>{" "}
              - the upstream cleaning pipeline that removes ANSI codes and extracts summaries
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING}
                className="text-pink-600 hover:underline"
              >
                Token Trimming
              </Link>{" "}
              - removes oldest messages when the conversation exceeds the context window
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

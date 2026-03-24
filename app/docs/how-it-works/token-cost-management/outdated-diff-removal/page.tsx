import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function OutdatedDiffRemovalPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.OUTDATED_DIFF_REMOVAL,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Outdated Diff Removal</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto removes old diff attempts for files that were edited again in later iterations.
            When a file has been modified multiple times during an agent session, only the latest
            apply_diff_to_file attempt is kept in the conversation history.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            When the agent edits a file 5 times across different iterations, keeping all 5 diff
            attempts wastes thousands of tokens and confuses the model about the current state of
            the file. Earlier diffs are no longer relevant because the file has changed since they
            were applied. The model might reference outdated line numbers or content from a previous
            version, leading to broken diffs in subsequent iterations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Reference Outdated Content</h2>
          <p className="text-gray-600 mb-4">
            In long conversations, earlier messages contain file contents and diffs that are no
            longer current. While the model can see the full conversation history, it has no
            reliable way to determine which version of a file is most recent when multiple versions
            appear across different messages. It might reference old line numbers or content that
            has since changed, producing diffs that fail to apply. Removing outdated versions
            eliminates the ambiguity entirely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before each API call, GitAuto scans the conversation history for apply_diff_to_file tool
            calls. It groups them by file path and identifies which files have multiple diff
            attempts. For each file with duplicates, it removes all but the most recent diff attempt
            (both the tool_use and tool_result messages). This reduces the conversation size without
            losing any information about the current state of modified files.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING}
                className="text-pink-600 hover:underline"
              >
                Token Trimming
              </Link>{" "}
              - trims oldest messages when the context window fills up
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

import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function StaleFileReplacementPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.STALE_FILE_REPLACEMENT,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Stale File Replacement</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            When a file has been read multiple times during an agent session, GitAuto replaces older
            read contents with a placeholder like &quot;[file content previously read - use latest
            version]&quot;. Only the most recent read of each file is preserved in full.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Reading the same 500-line file 3 times burns 1,500 lines of tokens in the conversation
            history. The agent only needs the current content of the file, not historical snapshots
            from earlier iterations. Each redundant copy wastes context window space that could be
            used for new file reads, tool calls, or the model&apos;s reasoning.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Why Models Don&apos;t Know Content Is Stale
          </h2>
          <p className="text-gray-600 mb-4">
            When the same file appears multiple times in the conversation, the model sees both
            versions but has no reliable way to determine which is current. The model can reason
            about message ordering to some degree, but with 50+ messages and multiple file versions
            scattered throughout, it frequently picks the wrong one. Replacing older versions with a
            placeholder removes the ambiguity and forces the model to use the latest content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before each API call, GitAuto scans the conversation for read_file tool results. It
            groups them by file path and identifies files that appear more than once. For each
            duplicate, it replaces the content of all but the most recent read with a short
            placeholder message. The tool_use/tool_result structure is preserved so the model still
            knows a read happened, but the bulk content is removed. This can save tens of thousands
            of tokens in sessions that repeatedly read the same files.
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
              - similarly deduplicates diff attempts per file
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING}
                className="text-pink-600 hover:underline"
              >
                Token Trimming
              </Link>{" "}
              - removes oldest messages when the context window fills up
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

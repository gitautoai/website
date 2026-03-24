import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function DiffHunkRepairPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Diff Hunk Repair</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto automatically recalculates and repairs incorrect line counts in unified diff
            hunk headers (<code>@@ -X,Y +A,B @@</code>). The model frequently gets these counts
            wrong because it cannot reliably count lines, making this one of the most common failure
            modes in AI-generated diffs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            When the model generates a unified diff, it must specify how many lines are removed and
            added in each hunk header. For example, <code>@@ -1,5 +1,7 @@</code> means 5 lines from
            the original and 7 lines in the new version. The model routinely miscounts these
            numbers, especially in larger hunks. When the counts are wrong, <code>git apply</code>{" "}
            silently fails or corrupts the file. Before this fix existed, wrong hunk counts were the
            single largest source of failed file edits.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Miscount Hunk Headers</h2>
          <p className="text-gray-600 mb-4">
            Models generate diffs token-by-token and cannot reliably count how many lines appear in
            each hunk. The hunk header (e.g., <code>@@ -1,7 +1,9 @@</code>) requires knowing the
            exact line count before the content is generated, but the model writes the header first
            and the content after. It is predicting the count before it knows what it will write.
            Benchmarks evaluate whether the final code is correct, not whether the diff format is
            valid, so models are never penalized for malformed hunk headers during training.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            After the model produces a diff, GitAuto runs a repair pass that uses regex to find each{" "}
            <code>@@</code> hunk header, then counts the actual context lines (lines starting with a
            space), removal lines (starting with <code>-</code>), and addition lines (starting with{" "}
            <code>+</code>) in the hunk body. It rebuilds each header with the correct counts.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-mono text-gray-700 mb-2">
              Before: <code>@@ -1,5 +1,7 @@</code> (wrong count)
            </p>
            <p className="text-sm font-mono text-gray-700">
              After: <code>@@ -1,5 +1,8 @@</code> (correct count)
            </p>
          </div>
          <p className="text-gray-600 mb-4">
            This repair runs automatically on every diff before <code>git apply</code> is called,
            requiring zero agent iterations and zero additional API calls.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_PREFIX_REPAIR}
                className="text-pink-600 hover:underline"
              >
                Diff Prefix Repair
              </Link>{" "}
              - Ensures proper <code>a/</code> and <code>b/</code> prefixes in diff file paths
            </li>
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION
                }
                className="text-pink-600 hover:underline"
              >
                Tool Argument Correction
              </Link>{" "}
              - Detects when diff arguments are sent to the wrong tool
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

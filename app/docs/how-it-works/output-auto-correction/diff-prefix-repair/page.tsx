import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function DiffPrefixRepairPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_PREFIX_REPAIR,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Diff Prefix Repair</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto ensures that unified diff files have proper <code>a/</code> and <code>b/</code>{" "}
            prefixes in their <code>---</code> and <code>+++</code> lines. The model often omits
            these prefixes, which causes <code>git apply</code> to reject the entire patch.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The unified diff format requires file paths in header lines to be prefixed with{" "}
            <code>a/</code> for the original and <code>b/</code> for the modified version. The model
            frequently generates diffs like <code>--- src/index.ts</code> instead of the correct{" "}
            <code>--- a/src/index.ts</code>. Without these prefixes, <code>git apply</code> rejects
            the patch outright. This was a persistent failure that wasted agent iterations because
            the error message from git was not always clear about the cause.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Forget Diff Prefixes</h2>
          <p className="text-gray-600 mb-4">
            The <code>a/</code> and <code>b/</code> prefixes are a git-specific convention that
            carries no semantic meaning - the file path is the same with or without them. Models
            have seen diffs with and without prefixes in training data (many online examples omit
            them), so the model has no strong signal that they are required. Since omitting them
            does not change the meaning of the diff, the model frequently drops them. Only strict
            format parsers like <code>git apply</code> care about their presence.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            After diff generation, GitAuto scans each <code>---</code> and <code>+++</code> line. If
            the file path does not already start with <code>a/</code> or <code>b/</code>, the prefix
            is added automatically. The special path <code>/dev/null</code> is skipped, since it
            represents newly created or deleted files and should not have a prefix.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-mono text-gray-700 mb-2">
              Before: <code>--- src/index.ts</code> / <code>+++ src/index.ts</code>
            </p>
            <p className="text-sm font-mono text-gray-700">
              After: <code>--- a/src/index.ts</code> / <code>+++ b/src/index.ts</code>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR}
                className="text-pink-600 hover:underline"
              >
                Diff Hunk Repair
              </Link>{" "}
              - Fixes incorrect line counts in hunk headers
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Trailing Space Removal
              </Link>{" "}
              - Strips trailing whitespace that can also corrupt diffs
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

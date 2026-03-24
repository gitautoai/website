import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ImportSortingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.IMPORT_SORTING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Import Sorting</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto automatically sorts import statements alphabetically after the model writes
            code. The sorter routes to language-specific implementations for Python and
            JavaScript/TypeScript, ensuring each language&apos;s conventions are respected.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Many projects enforce alphabetical import ordering through linters like ESLint&apos;s{" "}
            <code>sort-imports</code> rule or Python&apos;s <code>isort</code>. The model generates
            imports in whatever order it thinks of them, which is almost never alphabetical. Without
            auto-sorting, the generated code would fail linting on the first CI run, wasting an
            entire agent iteration just to reorder imports. By sorting after generation, GitAuto
            avoids this entirely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Don&apos;t Sort Imports</h2>
          <p className="text-gray-600 mb-4">
            Models generate code line-by-line in sequence. Maintaining alphabetical order requires
            global awareness of all imports before writing any of them. The model writes the first
            import, then the second, and so on - it does not go back and reorder. If it thinks of a
            new import mid-generation, it appends it where it thinks of it, not where it
            alphabetically belongs. No benchmark checks import order - a correct solution with
            unsorted imports scores identically to one with sorted imports.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            After code generation, GitAuto detects the file language from its extension and routes
            to the appropriate sorter. For JavaScript and TypeScript, it groups imports by type
            (external packages, internal modules, relative paths) and sorts alphabetically within
            each group. For Python, it follows the standard convention of grouping stdlib,
            third-party, and local imports. The sorting preserves any comments attached to import
            lines.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Trailing Space Removal
              </Link>{" "}
              - Another formatting fix applied before committing
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINT_DISABLE_HEADERS}
                className="text-pink-600 hover:underline"
              >
                Lint Disable Headers
              </Link>{" "}
              - Adds lint-disable comments that complement sorted imports
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

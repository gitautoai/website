import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function FormattingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.FORMATTING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Formatting</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto runs the project&apos;s code formatter on every generated file before committing
            it to the PR branch. For example, for JavaScript/TypeScript projects, it reads the{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.prettierrc</code> config
            and runs{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">npx prettier --write</code>{" "}
            to format it. Empty files and unsupported file types are skipped automatically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Inconsistent Formatting Blocks Reviews</h2>
          <p className="text-gray-600 mb-4">
            Formatting inconsistencies don&apos;t affect functionality, but they cause every PR to
            fail the team&apos;s formatting checks in CI. Developers then have to manually fix
            formatting before they can even review the actual logic changes.
          </p>
          <p className="text-gray-600 mb-4">
            By running the formatter with the project&apos;s own config, GitAuto ensures generated
            code matches the exact style the team enforces - tabs vs. spaces, semicolons vs. none,
            trailing commas, print width, and other formatting options.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Format Inconsistently</h2>
          <p className="text-gray-600 mb-4">
            Models generate code token-by-token with no global formatting plan. Indentation,
            spacing, and style choices are made locally at each token. The model might use 2-space
            indent in one block and 4-space in another within the same file, because each
            indentation token is predicted independently based on local context. Code generation
            benchmarks evaluate functional correctness, not formatting - a model gets the same score
            whether it uses 2-space or 4-space indentation, so there is no training signal to be
            consistent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before committing generated code, GitAuto checks if the repository has a formatter
            configuration. For example, for Prettier it looks for{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.prettierrc</code>,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.prettierrc.json</code>,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">prettier.config.js</code>,
            etc. If found, it writes the generated file to the working directory and runs{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">npx prettier --write</code>{" "}
            on it. The formatted output replaces the original, and that formatted version is what
            gets committed to the PR.
          </p>
          <p className="text-gray-600 mb-4">
            Files that the formatter cannot handle - binary files, unsupported extensions, or empty
            files - are silently skipped. This prevents formatter errors from blocking the entire PR
            creation process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.LINTING}
                className="text-pink-600 hover:underline"
              >
                Linting
              </Link>{" "}
              - fixes code quality issues that the formatter does not cover
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Trailing Space Removal
              </Link>{" "}
              - removes trailing whitespace as a fallback when a formatter is not configured
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

import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function LintDisableHeadersPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINT_DISABLE_HEADERS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Lint Disable Headers</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto automatically adds necessary lint-disable comments to the top of test files.
            Test files legitimately need certain lint rules disabled (unused variables in mocks,
            require statements for CommonJS), and without these headers, tests fail linting even
            when the test code is correct.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Test files have different linting needs than production code. Mock functions create
            variables that appear unused. CommonJS <code>require()</code> calls trigger ESLint rules
            designed for ES modules. Python test fixtures use function arguments that look unused to
            pylint. Without the correct disable comments at the top of each test file, CI linting
            fails on code that is structurally correct. The model sometimes adds these headers and
            sometimes forgets, leading to inconsistent results.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Why Models Don&apos;t Add Lint-Disable Comments
          </h2>
          <p className="text-gray-600 mb-4">
            Models focus on writing functionally correct code, not on satisfying linter
            configurations they have never seen. A model does not know that your project&apos;s
            ESLint config flags CommonJS requires or that PHPUnit test files need specific
            phpcs:disable comments. These are project-specific configuration details that exist
            outside the model&apos;s context. Benchmarks do not run project-specific linters, so a
            model is never penalized during evaluation for missing lint-disable comments and has no
            training signal to include them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            After generating a test file, GitAuto inspects the file extension and adds the
            appropriate lint-disable header. The system merges required rules to avoid duplicates:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2 mb-4">
            <li>
              <strong>TypeScript/JavaScript:</strong>{" "}
              <code>
                {
                  "/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */"
                }
              </code>
            </li>
            <li>
              <strong>Python:</strong>{" "}
              <code># pylint: disable=redefined-outer-name,unused-argument</code>
            </li>
            <li>
              <strong>PHP:</strong>{" "}
              <code>{"// phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter"}</code> placed
              after the <code>&lt;?php</code> tag
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            If the file already has a lint-disable header, the system merges the required rules into
            the existing header rather than adding a duplicate. For PHP files, the header is placed
            after the opening <code>&lt;?php</code> tag to maintain valid syntax.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.IMPORT_SORTING}
                className="text-pink-600 hover:underline"
              >
                Import Sorting
              </Link>{" "}
              - Sorts imports alphabetically, which lint-disable headers sit above
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Trailing Space Removal
              </Link>{" "}
              - Cleans up whitespace in generated headers
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

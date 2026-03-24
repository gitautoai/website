import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function LintingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.LINTING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Linting</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto runs the project&apos;s linter with auto-fix on every generated file. For
            example, for JavaScript/TypeScript projects, it runs ESLint with{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">--fix</code>, supporting
            both legacy <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.eslintrc</code>{" "}
            configs and the modern flat{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">eslint.config.js</code>{" "}
            format. Typed linting is enabled for TypeScript projects to catch unreachable code and
            type-level errors. Lint errors are separated from dead code detections so each is
            handled differently.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Lint Failures Block CI</h2>
          <p className="text-gray-600 mb-4">
            Generated code frequently has lint issues - unused imports, missing semicolons,
            inconsistent naming conventions, and style violations specific to the project&apos;s
            linter rules. These issues are trivial to fix but cause CI failures, forcing developers
            to manually clean up generated code before reviewing it.
          </p>
          <p className="text-gray-600 mb-4">
            By running the linter with auto-fix and zero-warning tolerance (e.g., ESLint with{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">--fix</code> and{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">--max-warnings 0</code>),
            GitAuto matches exactly what CI enforces. Auto-fixable issues like import ordering,
            missing semicolons, and unused variables are resolved automatically, saving iteration
            cycles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Produce Lint Violations</h2>
          <p className="text-gray-600 mb-4">
            Models generate code based on training data patterns, not based on your project&apos;s
            specific linter config. If your config bans{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">var</code> or requires
            explicit return types, the model doesn&apos;t know that. It writes code that&apos;s
            syntactically valid and functionally correct, but violates project-specific rules
            it&apos;s never seen. Benchmarks don&apos;t run linters - they check if the code
            compiles and passes tests. Models are never penalized during evaluation for lint
            violations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto detects the project&apos;s linter and configuration format. For example, for
            ESLint it detects whether the project uses the legacy format (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.eslintrc.*</code>) or the
            flat config format (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">eslint.config.js</code>) and
            adjusts its invocation accordingly. For TypeScript projects, typed linting is enabled so
            the linter can detect issues like unreachable code after type narrowing, unnecessary
            type assertions, and incorrect return types.
          </p>
          <p className="text-gray-600 mb-4">
            The linter output is parsed to separate lint errors (fixable code quality issues) from
            dead code detections (unreachable branches flagged by{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              @typescript-eslint/no-unnecessary-condition
            </code>
            ). Dead code is routed to the dead code removal pipeline rather than treated as a lint
            failure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.FORMATTING}
                className="text-pink-600 hover:underline"
              >
                Formatting
              </Link>{" "}
              - handles formatting rules that the linter delegates to the formatter
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Dead Code Removal
              </Link>{" "}
              - processes dead code detected by typed linting
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.IMPORT_SORTING}
                className="text-pink-600 hover:underline"
              >
                Import Sorting
              </Link>{" "}
              - sorts imports as a pre-step before the linter runs
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

import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function TypeCheckingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TYPE_CHECKING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Type Checking</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto runs static type checking on generated code to catch type errors before
            committing. For example, for TypeScript projects it runs{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">tsc --noEmit</code> with
            smart config selection, preferring test-specific configs like{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">tsconfig.test.json</code>{" "}
            when available and using{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">--incremental false</code>{" "}
            to avoid stale cache errors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Type Errors Waste Review Cycles</h2>
          <p className="text-gray-600 mb-4">
            Type errors in generated tests are common. Catching them before committing saves human
            reviewers from having to diagnose and fix type mismatches themselves.
          </p>
          <p className="text-gray-600 mb-4">
            Without this step, a PR might contain test files that look correct but fail type
            checking in CI, requiring another round of iteration just to fix types.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Produce Type Errors</h2>
          <p className="text-gray-600 mb-4">
            Models reason about types conceptually but don&apos;t run a type checker. A model
            &quot;knows&quot; that a function returns a string, but it can&apos;t verify that the
            actual TypeScript compiler agrees. Complex type interactions - generics, conditional
            types, overloads - are especially prone to errors because the model is pattern-matching,
            not type-checking. Code generation benchmarks primarily test Python and JavaScript -
            languages with weaker type systems. TypeScript&apos;s strict type checking is
            underrepresented in training and evaluation, so models are less practiced at getting
            complex types right.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto detects the project&apos;s type system and runs the appropriate checker. For
            example, for TypeScript it searches for test-specific configs in priority order:{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">tsconfig.test.json</code>,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">tsconfig.jest.json</code>,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">tsconfig.vitest.json</code>,
            then falls back to the default{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">tsconfig.json</code>. It
            runs{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              tsc --noEmit --incremental false
            </code>{" "}
            with the selected config to avoid picking up stale build info from previous runs.
          </p>
          <p className="text-gray-600 mb-4">
            The output is filtered to remove errors from{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">node_modules</code> since
            those are third-party type issues outside GitAuto&apos;s control. Only errors in the
            generated files and project source are reported back to the agent for correction.
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
              - catches code quality issues that type checking does not cover
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TEST_EXECUTION}
                className="text-pink-600 hover:underline"
              >
                Test Execution
              </Link>{" "}
              - verifies runtime behavior after type checking passes
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

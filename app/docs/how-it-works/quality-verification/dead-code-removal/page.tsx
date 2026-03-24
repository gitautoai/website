import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function DeadCodeRemovalPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Dead Code Removal</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto detects and removes unreachable code using static analysis tools like
            ESLint&apos;s{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              @typescript-eslint/no-unnecessary-condition
            </code>{" "}
            rule. Dead code errors are separated from regular lint errors so they can be handled
            differently - dead code is removed from the source file rather than treated as a lint
            violation to fix.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Dead Branches Make 100% Coverage Impossible
          </h2>
          <p className="text-gray-600 mb-4">
            If a branch can never be reached - for example, checking a type guard that TypeScript
            proves is always true, or a catch block after a synchronous operation that cannot throw
            - testing it is impossible. The coverage report shows those lines as uncovered, and the
            agent would spend all its iterations trying to write tests that exercise code paths that
            cannot execute.
          </p>
          <p className="text-gray-600 mb-4">
            Removing dead code improves coverage percentages without writing fake tests. Instead of
            producing a mock that forces an impossible condition to appear true, GitAuto removes the
            dead branch entirely, making the codebase cleaner and the coverage numbers accurate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Write Tests for Dead Code</h2>
          <p className="text-gray-600 mb-4">
            Models can&apos;t determine whether a code branch is reachable at runtime. They see an
            if/else and try to test both branches, even when TypeScript&apos;s type system proves
            one branch can never execute. The model generates increasingly contrived mocks to force
            the dead branch to run, producing tests that pass but test impossible scenarios. Only
            static analysis (type-aware linting) can definitively identify dead code. No benchmark
            evaluates whether a test is testing reachable code - a test that passes by mocking
            impossible conditions scores the same as a meaningful test.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            During the linting step, GitAuto runs static analysis that can identify conditions that
            are always true or always false - meaning one branch of an if/else or ternary can never
            execute. For example, ESLint with typed linting uses TypeScript&apos;s type information
            via the{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              @typescript-eslint/no-unnecessary-condition
            </code>{" "}
            rule to detect these unreachable branches.
          </p>
          <p className="text-gray-600 mb-4">
            GitAuto parses the linting output and separates dead code detections from regular lint
            errors. Dead code is fed to the model with instructions to remove the unreachable branch
            while preserving the reachable code. The resulting diff removes the dead branch, and
            coverage naturally improves because there are fewer lines that need to be covered.
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
              - provides the typed linting output that identifies dead code
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION}
                className="text-pink-600 hover:underline"
              >
                Untestable Detection
              </Link>{" "}
              - identifies code that is hard to test but not provably dead
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - benefits from dead code removal by having fewer uncoverable lines
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

import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function CoverageEnforcementPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Coverage Enforcement</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            After running tests, GitAuto checks if code coverage reaches the target - 100% for new
            test files. It posts a coverage comment on the PR showing line, branch, and function
            coverage percentages. Uncovered lines are flagged and fed back to the agent so it can
            write additional tests to cover them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Passing Tests Can Still Have Low Coverage</h2>
          <p className="text-gray-600 mb-4">
            Without enforcement, tests that technically pass only cover the happy path. A function
            with five branches might get a test that exercises one of them, achieving 30% coverage
            while ignoring error handling, edge cases, and boundary conditions. The tests
            &quot;pass&quot; but provide minimal value.
          </p>
          <p className="text-gray-600 mb-4">
            Coverage enforcement creates a feedback loop: the agent writes tests, coverage is
            measured, uncovered lines are identified, and the agent iterates until the target is
            reached. This drives comprehensive test coverage rather than superficial test existence.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Only Test the Happy Path</h2>
          <p className="text-gray-600 mb-4">
            Models have a strong bias toward generating the most obvious, straightforward test case.
            Testing error paths, edge cases, and boundary conditions requires adversarial thinking -
            imagining what could go wrong. Models default to &quot;demonstrate the function
            works&quot; rather than &quot;prove the function handles failures.&quot; Without a
            feedback loop showing uncovered lines, the model considers its job done after one
            passing test. Training data and benchmarks reinforce this - most test examples in
            training data are happy-path tests, and code generation benchmarks only check &quot;does
            the test pass,&quot; not &quot;does the test cover edge cases.&quot;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            After the test runner finishes, GitAuto parses the coverage output to extract line,
            branch, and function coverage percentages for the source file being tested. For new test
            files (files that didn&apos;t exist before), the target is 100%. The coverage report
            identifies specific uncovered line ranges.
          </p>
          <p className="text-gray-600 mb-4">
            If coverage falls below the target, uncovered lines are sent back to the model with the
            source context, and another iteration begins. GitAuto also posts a coverage summary
            comment on the PR so reviewers can see the coverage achieved at a glance, even if 100%
            was reached and no manual review of coverage is needed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TEST_EXECUTION}
                className="text-pink-600 hover:underline"
              >
                Test Execution
              </Link>{" "}
              - runs the tests that produce the coverage data
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION}
                className="text-pink-600 hover:underline"
              >
                Untestable Detection
              </Link>{" "}
              - identifies code that cannot be covered, adjusting effective targets
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Dead Code Removal
              </Link>{" "}
              - removes unreachable code that would otherwise reduce coverage percentages
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

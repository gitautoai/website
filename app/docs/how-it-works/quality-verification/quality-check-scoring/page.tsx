import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function QualityCheckScoringPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECK_SCORING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Quality Check Scoring</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto evaluates test quality beyond raw coverage numbers. After tests pass and
            coverage targets are met, a separate evaluation scores the tests across multiple quality
            categories. Each source file and its test files are analyzed together to identify gaps
            that coverage metrics alone cannot detect - missing edge cases, security
            vulnerabilities, performance regressions, and more.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Coverage Is Not Enough</h2>
          <p className="text-gray-600 mb-4">
            100% line coverage means every line executes during tests. It does not mean the tests
            verify correct behavior. A function that parses user input can achieve full coverage
            with a single valid input string, while missing SQL injection, XSS, null bytes, Unicode
            edge cases, and boundary values entirely. The lines run, but the dangerous paths are
            never tested.
          </p>
          <p className="text-gray-600 mb-4">
            Quality check scoring fills this gap by evaluating what the tests actually verify, not
            just what code they happen to execute. A test file that covers 100% of lines but ignores
            adversarial inputs scores poorly on the adversarial category, signaling that the tests
            need strengthening.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">The 7 Quality Categories</h2>
          <p className="text-gray-600 mb-4">
            Each source file is evaluated against checks organized into these categories:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-4">
            <li>
              <strong>Adversarial</strong> - null/undefined inputs, empty strings and arrays,
              boundary values, type coercion, large inputs, race conditions, Unicode and special
              characters
            </li>
            <li>
              <strong>Security</strong> - XSS, SQL injection, command injection, code injection,
              CSRF, auth bypass, sensitive data exposure, input sanitization, open redirects, path
              traversal
            </li>
            <li>
              <strong>Performance</strong> - quadratic algorithms, heavy synchronous operations, N+1
              queries, large imports, redundant computation
            </li>
            <li>
              <strong>Memory</strong> - event listener cleanup, subscription and timer cleanup,
              circular references, closure retention
            </li>
            <li>
              <strong>Error Handling</strong> - graceful degradation, user-facing error messages
            </li>
            <li>
              <strong>Accessibility</strong> - ARIA attributes, keyboard navigation, screen reader
              support, focus management
            </li>
            <li>
              <strong>SEO</strong> - meta tags, semantic HTML, heading hierarchy, alt text
            </li>
          </ul>
          <p className="text-gray-600 mt-4">
            Not every check applies to every file. A backend utility function has no accessibility
            or SEO concerns. The evaluator marks inapplicable checks accordingly so they do not
            penalize the score.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Change Detection with Blob SHA</h2>
          <p className="text-gray-600 mb-4">
            Quality evaluation uses Claude to analyze source and test files together, which costs
            tokens and takes time. Running it on every PR for every file would be wasteful when most
            files have not changed. GitAuto uses Git blob SHAs to detect changes efficiently.
          </p>
          <p className="text-gray-600 mb-4">
            Three values are tracked per source file: the implementation file&apos;s blob SHA, the
            test file&apos;s blob SHA, and a hash of the quality checklist itself. Re-evaluation
            triggers only when at least one of these changes. If the source code changes, the
            existing tests may no longer cover the new logic. If the test file changes, the quality
            scores may have improved or regressed. If the checklist adds new check items, previously
            passing files need scoring against the expanded criteria.
          </p>
          <p className="text-gray-600 mb-4">
            When none of the three values change, the stored quality scores are reused. This makes
            quality checking practical even for repositories with thousands of source files - only
            modified files pay the evaluation cost.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How Scoring Drives PR Creation</h2>
          <p className="text-gray-600 mb-4">
            When quality gaps are found, GitAuto creates PRs to strengthen the tests. The evaluation
            results identify specific categories where tests are weak - for example, a file with no
            adversarial tests or missing error handling coverage. These specific gaps become the
            scope of the generated PR, so the agent knows exactly what types of tests to add rather
            than guessing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Quality Gate Enforcement</h2>
          <p className="text-gray-600 mb-4">
            Creating a PR is not enough - the agent must actually improve the tests. When the agent
            declares the task complete, a quality gate verifies the work. For quality-focused PRs
            (created by the scheduler or dashboard), this gate has two layers:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2 mb-4">
            <li>
              <strong>Zero-change rejection</strong> - if the agent made no changes to the test file,
              the task is rejected immediately. The scheduler already determined the tests were weak
              when it created the PR, so &quot;no changes needed&quot; is not a valid completion.
            </li>
            <li>
              <strong>Post-change evaluation</strong> - after the agent makes changes and all other
              checks pass (linting, type checking, test execution), the quality evaluation runs again
              on the updated test files. If the tests still fail quality checks, the agent must
              iterate.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            The post-change evaluation runs last to avoid wasting an LLM call when the agent will
            need to retry anyway due to lint or test failures. If the agent genuinely cannot improve
            the tests after a retry, the system allows completion to prevent infinite loops.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECKLIST}
                className="text-pink-600 hover:underline"
              >
                Quality Checklist
              </Link>{" "}
              - the full list of 41 checks across 8 categories used during scoring
            </li>
            <li>
              <Link
                href="/blog/what-100-percent-test-coverage-cant-measure"
                className="text-pink-600 hover:underline"
              >
                What 100% Test Coverage Can&apos;t Measure
              </Link>{" "}
              - blog post on why quality checks exist beyond coverage
            </li>
            <li>
              <Link
                href="/blog/tests-can-go-stale-at-100-percent-coverage"
                className="text-pink-600 hover:underline"
              >
                Tests Can Go Stale at 100% Coverage
              </Link>{" "}
              - blog post on the content hashing pattern used for change detection
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - enforces line, branch, and function coverage targets before quality scoring begins
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION}
                className="text-pink-600 hover:underline"
              >
                Untestable Detection
              </Link>{" "}
              - identifies code that cannot be meaningfully tested, preventing false quality gaps
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

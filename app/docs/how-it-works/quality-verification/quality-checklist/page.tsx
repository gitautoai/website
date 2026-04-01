import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function QualityChecklistPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECKLIST,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Quality Checklist</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto evaluates every source file against 41 individual checks organized into 8
            categories. Each check is scored as &quot;pass&quot; (the test covers this concern),
            &quot;fail&quot; (the test should cover this but does not), or &quot;na&quot; (not
            applicable to this file). This page lists every check in the checklist.
          </p>
          <p className="text-gray-600 mb-4">
            Not every check applies to every file. A backend utility has no accessibility or SEO
            concerns. A pure computation function has no event listeners to clean up. The evaluator
            marks inapplicable checks as &quot;na&quot; so they do not penalize the score. For
            details on how scores are calculated and how change detection works, see{" "}
            <Link
              href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECK_SCORING}
              className="text-pink-600 hover:underline"
            >
              Quality Check Scoring
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Business Logic (5 checks)</h2>
          <p className="text-gray-600 mb-4">
            Verifies that tests exercise the core business rules and domain-specific behavior of the
            code, not just its technical correctness.
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Domain rules</strong> - tests enforce business rules specific to the domain
              (e.g., pricing tiers, eligibility criteria, validation constraints)
            </li>
            <li>
              <strong>State transitions</strong> - tests verify that objects move through valid
              states and reject invalid transitions
            </li>
            <li>
              <strong>Calculation accuracy</strong> - tests confirm numeric computations produce
              correct results, including rounding, currency, and precision
            </li>
            <li>
              <strong>Data integrity</strong> - tests ensure data consistency across operations
              (e.g., totals match line items, foreign keys remain valid)
            </li>
            <li>
              <strong>Workflow correctness</strong> - tests validate multi-step processes execute in
              the correct order with correct side effects
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Adversarial (7 checks)</h2>
          <p className="text-gray-600 mb-4">
            Checks whether tests probe the code with unexpected, malformed, or extreme inputs that
            real-world usage and attackers will produce.
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Null and undefined inputs</strong> - tests pass null, undefined, or missing
              values to every input that could receive them
            </li>
            <li>
              <strong>Empty strings and arrays</strong> - tests verify behavior when strings are
              empty and arrays/collections have zero elements
            </li>
            <li>
              <strong>Boundary values</strong> - tests exercise minimum, maximum, zero, negative,
              and off-by-one values for numeric and sized inputs
            </li>
            <li>
              <strong>Type coercion</strong> - tests pass values of unexpected types (string where
              number expected, object where array expected) to verify handling
            </li>
            <li>
              <strong>Large inputs</strong> - tests provide oversized strings, deeply nested
              objects, or arrays with thousands of elements
            </li>
            <li>
              <strong>Race conditions</strong> - tests verify correct behavior under concurrent
              access, parallel execution, or rapid repeated calls
            </li>
            <li>
              <strong>Unicode and special characters</strong> - tests include emoji, RTL text, null
              bytes, control characters, and multi-byte sequences
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Security (10 checks)</h2>
          <p className="text-gray-600 mb-4">
            Evaluates whether tests attempt common attack vectors against the code to verify it
            rejects malicious input.
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>XSS</strong> - tests inject script tags, event handlers, and encoded payloads
              into user-facing outputs
            </li>
            <li>
              <strong>SQL injection</strong> - tests pass SQL fragments, quotes, and UNION
              statements through inputs that reach database queries
            </li>
            <li>
              <strong>Command injection</strong> - tests include shell metacharacters, pipes, and
              backticks in inputs that reach system command execution
            </li>
            <li>
              <strong>Code injection</strong> - tests attempt to inject executable code through
              eval, template literals, or dynamic imports
            </li>
            <li>
              <strong>CSRF</strong> - tests verify that state-changing operations require valid
              tokens or origin verification
            </li>
            <li>
              <strong>Auth bypass</strong> - tests attempt to access protected resources without
              credentials or with expired/invalid tokens
            </li>
            <li>
              <strong>Sensitive data exposure</strong> - tests confirm that passwords, tokens, and
              PII are not leaked in logs, responses, or error messages
            </li>
            <li>
              <strong>Untrusted input sanitization</strong> - tests verify that all external input
              is sanitized before use in rendering, queries, or commands
            </li>
            <li>
              <strong>Open redirects</strong> - tests pass external URLs to redirect parameters and
              verify they are rejected or restricted to allowed domains
            </li>
            <li>
              <strong>Path traversal</strong> - tests use &quot;../&quot; sequences, absolute paths,
              and encoded slashes to attempt file system escapes
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Performance (5 checks)</h2>
          <p className="text-gray-600 mb-4">
            Identifies whether tests detect code patterns that degrade performance at scale, even if
            they work correctly on small inputs.
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Quadratic algorithms</strong> - tests run the code with large enough inputs to
              expose O(n^2) or worse complexity that is hidden by small test data
            </li>
            <li>
              <strong>Heavy synchronous operations</strong> - tests verify that long-running
              computations, file I/O, or network calls do not block the main thread or event loop
            </li>
            <li>
              <strong>N+1 queries</strong> - tests confirm that operations on collections use batch
              queries rather than issuing one query per item
            </li>
            <li>
              <strong>Large imports</strong> - tests verify that importing the module does not pull
              in unnecessarily large dependencies that slow startup
            </li>
            <li>
              <strong>Redundant computation</strong> - tests check that repeated calls with the same
              input use caching or memoization rather than recomputing
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Memory (4 checks)</h2>
          <p className="text-gray-600 mb-4">
            Checks whether tests verify proper resource cleanup to prevent memory leaks in
            long-running applications.
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Event listener cleanup</strong> - tests verify that event listeners added
              during setup are removed during teardown or component unmounting
            </li>
            <li>
              <strong>Subscription and timer cleanup</strong> - tests confirm that subscriptions,
              intervals, and timeouts are cleared when no longer needed
            </li>
            <li>
              <strong>Circular references</strong> - tests check that object graphs do not create
              reference cycles that prevent garbage collection
            </li>
            <li>
              <strong>Closure retention</strong> - tests verify that closures do not capture and
              retain large objects beyond their useful lifetime
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Error Handling (2 checks)</h2>
          <p className="text-gray-600 mb-4">
            Evaluates whether tests verify that the code fails gracefully and communicates errors
            clearly to users.
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Graceful degradation</strong> - tests trigger error conditions (network
              failures, missing files, invalid data) and verify the code recovers or fails safely
              without crashing
            </li>
            <li>
              <strong>User error messages</strong> - tests confirm that error messages shown to
              users are helpful, do not expose internal details, and guide toward resolution
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Accessibility (4 checks)</h2>
          <p className="text-gray-600 mb-4">
            Checks whether tests verify that UI components are usable by people with disabilities,
            following WCAG guidelines.
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>ARIA attributes</strong> - tests verify that interactive elements have correct
              ARIA roles, labels, and states for assistive technology
            </li>
            <li>
              <strong>Keyboard navigation</strong> - tests confirm that all interactive elements are
              reachable and operable using only the keyboard
            </li>
            <li>
              <strong>Screen reader support</strong> - tests check that content is announced
              correctly by screen readers, including live regions and status updates
            </li>
            <li>
              <strong>Focus management</strong> - tests verify that focus moves logically through
              the interface, especially after modals, route changes, and dynamic content updates
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. SEO (4 checks)</h2>
          <p className="text-gray-600 mb-4">
            Evaluates whether tests verify that pages produce correct metadata and semantic markup
            for search engine indexing.
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Meta tags</strong> - tests verify that pages render correct title,
              description, Open Graph, and Twitter Card meta tags
            </li>
            <li>
              <strong>Semantic HTML</strong> - tests check that pages use appropriate HTML5 semantic
              elements (header, main, nav, article, section) rather than generic divs
            </li>
            <li>
              <strong>Heading hierarchy</strong> - tests verify that headings follow a logical h1
              through h6 hierarchy without skipping levels
            </li>
            <li>
              <strong>Alt text</strong> - tests confirm that all images have descriptive alt
              attributes for search engines and accessibility
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECK_SCORING}
                className="text-pink-600 hover:underline"
              >
                Quality Check Scoring
              </Link>{" "}
              - explains how individual check results are aggregated into scores and how change
              detection avoids redundant evaluation
            </li>
            <li>
              <Link
                href="/blog/what-100-percent-test-coverage-cant-measure"
                className="text-pink-600 hover:underline"
              >
                What 100% Test Coverage Can&apos;t Measure
              </Link>{" "}
              - blog post explaining why these checks exist and what coverage alone misses
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - enforces line, branch, and function coverage targets before quality checks run
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

import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function UntestableDetectionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Untestable Detection</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto uses the AI model to evaluate whether uncovered code is genuinely untestable or
            whether it should be removed. Genuinely untestable code includes async error handlers
            buried inside event handlers, race condition paths, and logically dead branches.
            Testable code - anything that can be mocked, spied on, or exercised through inputs - is
            sent back for more test iterations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Wasted Iterations on Unreachable Code</h2>
          <p className="text-gray-600 mb-4">
            Some code is structurally impossible to unit test. A catch block inside a setTimeout
            callback that only fires on a network error during a WebSocket reconnection cannot be
            reliably triggered in a unit test. Without untestable detection, the agent would waste
            all its remaining iterations trying to cover unreachable code - writing increasingly
            convoluted mocks that still fail to hit the target lines.
          </p>
          <p className="text-gray-600 mb-4">
            By identifying genuinely untestable code early, GitAuto can either skip those lines from
            the coverage target or suggest that the developer remove/refactor them. This focuses the
            agent&apos;s iterations on code that can actually be tested.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Can&apos;t Judge Testability</h2>
          <p className="text-gray-600 mb-4">
            Models attempt to test any code they&apos;re given, regardless of whether it&apos;s
            practically testable. Dead code, platform-specific branches, and tightly coupled I/O
            operations resist unit testing, but the model doesn&apos;t know that until it&apos;s
            already spent several iterations trying and failing. Evaluating testability requires
            reasoning about the code&apos;s runtime behavior - something that needs a separate,
            focused analysis step. No benchmark gives the model untestable code and evaluates
            whether it correctly identifies it as untestable. Models are trained to always produce
            output, not to say &quot;this cannot be done.&quot;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When coverage enforcement identifies uncovered lines after multiple iterations, GitAuto
            sends those uncovered code sections to the model with a specific evaluation prompt. The
            model analyzes each uncovered section and classifies it as either &quot;untestable&quot;
            (with a reason) or &quot;testable&quot; (with a suggested approach).
          </p>
          <p className="text-gray-600 mb-4">
            Untestable classifications include: async error handlers in event listeners, race
            condition handling, defensive code for impossible states, and platform-specific code
            paths. Testable classifications include: code that can be reached through dependency
            injection, code that responds to mockable function calls, and branches reachable through
            specific input values.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - provides the uncovered line data that triggers untestable analysis
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Dead Code Removal
              </Link>{" "}
              - removes code identified as unreachable rather than merely untestable
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SHOULD_SKIP_DETECTION}
                className="text-pink-600 hover:underline"
              >
                Should-Skip Detection
              </Link>{" "}
              - skips entire files before test generation, while untestable detection operates at
              the line level
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

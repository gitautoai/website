import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ErrorBaselinesPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.ERROR_BASELINES,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Error Baselines</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            Before generating tests, GitAuto captures all pre-existing errors in the codebase by
            running the relevant compiler or linter (e.g.,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">tsc --noEmit</code> for
            TypeScript). After test generation, it compares the new error output against this
            baseline to separate errors introduced by the generated code from errors that already
            existed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Many real-world codebases carry pre-existing errors - suppressed warnings, incomplete
            type migrations, or intentionally loose checks in legacy modules. Without a baseline,
            the model tries to fix every error it sees, including ones that have nothing to do with
            the generated tests. This wastes agent iterations on unrelated issues and often makes
            things worse - the model might &quot;fix&quot; an error in production code that was
            intentionally left alone, or spend its entire iteration budget chasing pre-existing
            issues instead of refining the test it just wrote. Error baselines let GitAuto say:
            &quot;ignore these 47 errors - they existed before you started. Focus only on the 3 new
            ones.&quot;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Why Models Can&apos;t Distinguish Old From New
          </h2>
          <p className="text-gray-600 mb-4">
            When the model runs a verification command (e.g.,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">tsc --noEmit</code>), it
            gets back a flat list of errors with no indication of which ones are pre-existing. The
            model sees 50 errors and tries to fix all 50 - it has no way to know that 47 of them
            existed before it started. The verification output treats all errors equally, so the
            model does too. This wastes iterations on issues the model didn&apos;t cause and often
            makes things worse by &quot;fixing&quot; intentionally loose typing in legacy code that
            was left that way on purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto runs the relevant compiler or linter in check-only mode before the agent begins
            writing code. The error output is stored as the baseline. After the model generates or
            modifies files, GitAuto runs the same check again and diffs the two outputs. Only errors
            that appear in the second run but not the first are reported to the model as actionable
            issues. This filtering happens at the file and line level, so even if an existing file
            gains new errors from the generated code, only those new errors are surfaced.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TYPE_CHECKING}
                className="text-pink-600 hover:underline"
              >
                Type Checking
              </Link>{" "}
              - the verification step that uses the baseline for comparison
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CI_LOG_CLEANING}
                className="text-pink-600 hover:underline"
              >
                CI Log Cleaning
              </Link>{" "}
              - cleans noise from CI logs, a related denoising technique
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

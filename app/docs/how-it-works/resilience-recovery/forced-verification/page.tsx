import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ForcedVerificationPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.FORCED_VERIFICATION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Forced Verification</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            If the agent loop exhausts all iterations without completing verification (e.g.,
            formatting, linting, type checking, tests), GitAuto forces a verification run as a final
            step. This ensures no PR ships without at least one quality check.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            An agent might spend all its iterations writing code and fixing issues, never reaching
            the verification step. The agent gets caught in loops - fixing one test breaks another,
            fixing that breaks a type check, and so on. Without forced verification, the PR would be
            created with untested, unformatted, potentially broken code. Users would merge a PR
            thinking it passed quality checks when none were ever run.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Skip Verification</h2>
          <p className="text-gray-600 mb-4">
            There is no guarantee the model will call verification tools at the end of its run.
            Models tend to forget multi-step workflows - they focus on the immediate task (writing
            and fixing code) and skip the final verification step. Even with explicit instructions
            to verify, the model may get caught in fix loops and never reach it, or simply stop
            after the code looks correct to it. Benchmarks evaluate the generated code directly, not
            whether the model ran verification. There is no training reward for &quot;I checked my
            work.&quot;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto tracks whether verification has been completed during the agent session. If the
            iteration counter reaches the limit and verification has not run, GitAuto adds a forced
            verification step outside the normal iteration count. This step runs the project&apos;s
            formatter, linter, type checker, and test suite. The results are included in the PR
            description so reviewers can see the verification status, even if some checks failed.
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
              - one of the verification steps that gets forced
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

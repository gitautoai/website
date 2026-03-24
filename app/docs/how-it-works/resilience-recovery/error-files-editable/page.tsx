import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ErrorFilesEditablePage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.ERROR_FILES_EDITABLE,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Error Files Editable</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            When verification finds errors in source files (not test files), those files are
            automatically added to the edit allowlist so the agent can fix them in subsequent
            iterations. This bridges the gap between strict file edit restrictions and the need to
            fix source code issues caused by new tests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            File edit restrictions block source file edits by default to prevent the model from
            modifying production code. But sometimes a new test file reveals a real issue in the
            source: a missing export, an incorrect type signature, or an unhandled edge case. If the
            type checker or linter reports errors in a source file caused by the new test, the agent
            needs permission to fix it. Without this feature, the agent would be stuck in a loop -
            it knows the fix but cannot apply it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Need Dynamic Permissions</h2>
          <p className="text-gray-600 mb-4">
            When a model generates a test that causes type errors in a source file, it knows exactly
            how to fix the source file but can&apos;t because of file edit restrictions. The model
            can see the fix but can&apos;t apply it, leading to frustration loops where it tries
            increasingly convoluted workarounds in the test file instead of making the simple fix in
            the source file.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            After each verification step (e.g., type checking, linting, test execution), GitAuto
            parses the error output to extract file paths. If any error file is a source file (not a
            test file) and is not already in the allowlist, GitAuto adds it. The agent is then
            informed that these files are now editable and can fix the errors in the next iteration.
            Only files explicitly mentioned in error output are unlocked - this prevents the agent
            from using verification errors as a pretext to edit unrelated source files.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.FILE_EDIT_RESTRICTIONS}
                className="text-pink-600 hover:underline"
              >
                File Edit Restrictions
              </Link>{" "}
              - the default restriction that this feature selectively overrides
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TYPE_CHECKING}
                className="text-pink-600 hover:underline"
              >
                Type Checking
              </Link>{" "}
              - one of the verification steps that can trigger file unlocking
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

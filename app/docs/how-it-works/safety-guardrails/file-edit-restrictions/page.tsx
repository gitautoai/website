import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function FileEditRestrictionsPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.FILE_EDIT_RESTRICTIONS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">File Edit Restrictions</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto restricts which files the model can edit during a test-generation run. By
            default, only test files and explicitly allowed files can be modified. Markdown files
            and GITAUTO.md are always editable. When errors are found in source files during the
            read-edit-test loop, those specific files are added to the allowlist so the model can
            fix them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Without restrictions, the model modifies production source code while trying to make
            tests pass. It changes function signatures, removes validation logic, or
            &quot;fixes&quot; the source to match wrong tests. The result is a PR that passes tests
            but breaks the application. File edit restrictions prevent this by making source files
            read-only unless errors explicitly point to them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Edit Production Code</h2>
          <p className="text-gray-600 mb-4">
            Models optimize for making tests pass, not for respecting file boundaries. If modifying
            a source file makes the test pass more easily, the model will do it - changing a
            function&apos;s signature, adding an export, or weakening a type constraint. The model
            sees test failure as the problem and any edit as a valid solution, with no inherent
            concept of &quot;this file is off-limits.&quot; Training reinforces this: the reward
            signal is making tests pass. If modifying source code achieves that goal faster, the
            model has learned that is a valid strategy. No training signal distinguishes &quot;good
            fix&quot; from &quot;you were not supposed to touch that file.&quot;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before each tool call that writes or modifies a file, GitAuto checks whether the target
            path is in the allowlist. Test files (matching patterns like{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">*.test.ts</code>,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">*_test.py</code>, etc.) are
            always allowed. If a CI error or type-check error references a specific source file,
            GitAuto adds that file to the allowlist for subsequent iterations. Any attempt to edit a
            file outside the allowlist is blocked, and the model is told to focus on test files
            instead.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.ERROR_FILES_EDITABLE}
                className="text-pink-600 hover:underline"
              >
                Error Files Editable
              </Link>{" "}
              - dynamically unlocks source files when errors point to them
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

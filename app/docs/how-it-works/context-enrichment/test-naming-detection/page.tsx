import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function TestNamingDetectionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_NAMING_DETECTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Test Naming Detection</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto walks the repository directory tree, matches test files against 6 common naming
            patterns, and determines the dominant convention. If 60% or more of test files use a
            single pattern, GitAuto tells the model to follow it - for example, &quot;Use .spec.
            naming (e.g., User.spec.ts).&quot;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Consistency Matters</h2>
          <p className="text-gray-600 mb-4">
            CI configurations rely on specific glob patterns to discover test files. Developers
            scanning a directory expect a single convention. Mixed naming ({" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.test.ts</code> next to{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.spec.ts</code> next to{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">test_user.py</code>) creates
            confusion and can cause test runners to miss files entirely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Need Application-Layer Help</h2>
          <p className="text-gray-600 mb-4">
            Models are fundamentally non-deterministic - even at temperature 0, the same prompt can
            produce different outputs across runs. Naming conventions are arbitrary choices with no
            &quot;correct&quot; answer, so without explicit guidance the model picks whichever
            pattern it has seen most in training data - which varies with context. More importantly,
            the model has no memory across separate runs, so each session starts fresh with no
            knowledge of what previous sessions chose. Telling the model &quot;be consistent&quot;
            does not help because it has nothing to be consistent with. The only reliable fix is to
            detect the convention at the application layer and inject it as a concrete directive. No
            benchmark penalizes inconsistent test file naming across PRs - models are evaluated on
            individual task correctness, not cross-session consistency.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto scans the repo and tallies test files against 6 patterns:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2 mb-4">
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.spec.</code> - e.g.,{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">User.spec.ts</code>
            </li>
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.test.</code> - e.g.,{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">User.test.ts</code>
            </li>
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">test_</code> prefix -
              e.g., <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">test_user.py</code>
            </li>
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">Test</code> suffix - e.g.,{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">UserTest.java</code>
            </li>
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">_test</code> suffix -
              e.g., <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">user_test.go</code>
            </li>
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">_spec</code> suffix -
              e.g., <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">user_spec.rb</code>
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            If any single pattern accounts for 60% or more of test files, GitAuto declares it the
            dominant convention and injects a directive into the model&apos;s system message. If no
            pattern reaches the threshold, GitAuto falls back to the language&apos;s idiomatic
            default.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_FILE_PRELOADING}
                className="text-pink-600 hover:underline"
              >
                Test File Preloading
              </Link>{" "}
              - loads example test files so the model sees the naming in practice
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES}
                className="text-pink-600 hover:underline"
              >
                Repository Rules
              </Link>{" "}
              - allows manual override of the detected naming convention
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

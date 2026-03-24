import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ShouldSkipDetectionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SHOULD_SKIP_DETECTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Should-Skip Detection</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto analyzes source files before test generation to determine if they need tests at
            all. Files that contain no testable behavior are skipped: empty files, type definitions
            and interfaces, constant/literal exports, import/export-only barrel files, and simple
            data classes without methods. Detection is routed to language-specific analyzers for
            accurate classification.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Wasting Credits on Non-Testable Files</h2>
          <p className="text-gray-600 mb-4">
            Generating tests for a TypeScript interface file or a constants file wastes credits and
            produces meaningless tests. A test for{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">types.ts</code> that just
            imports the types and asserts they exist adds no value. A test for{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">constants.ts</code> that
            checks if{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              API_URL === &quot;https://...&quot;
            </code>{" "}
            is testing the constant&apos;s value, not behavior.
          </p>
          <p className="text-gray-600 mb-4">
            By detecting and skipping these files upfront, GitAuto avoids wasting agent iterations
            and customer credits on files that would produce hollow tests. The agent can focus on
            files with actual logic to test.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Try to Test Everything</h2>
          <p className="text-gray-600 mb-4">
            Models don&apos;t inherently distinguish between files that contain testable logic and
            files that don&apos;t. A TypeScript interface file, a constants file, or a type
            definition file has no executable code, but the model will still attempt to generate
            tests for it - creating meaningless tests that assert types exist or constants have
            values. The model sees &quot;file needs tests&quot; and complies literally. Training
            data includes examples of &quot;write a test for this file&quot; with no distinction
            between testable and non-testable files, so the model has learned to always comply with
            test generation requests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before generating a test, GitAuto reads the source file and runs it through a
            language-specific analyzer. For TypeScript/JavaScript, it checks if the file contains
            only type exports, interfaces, constants, or re-exports. For PHP, it checks for similar
            patterns like empty classes or pure configuration arrays.
          </p>
          <p className="text-gray-600 mb-4">
            The skip categories include: empty files with no meaningful content, pure type/interface
            declarations with no runtime code, constant exports with only literal values,
            barrel/index files that only re-export from other modules, and simple data transfer
            objects without methods. Files that pass all checks proceed to test generation normally.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION}
                className="text-pink-600 hover:underline"
              >
                Untestable Detection
              </Link>{" "}
              - evaluates specific lines within testable files, while should-skip operates at the
              file level
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - skipped files are excluded from coverage calculations
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

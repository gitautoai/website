import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function PhpunitSupportPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.PHPUNIT_SUPPORT,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">PHPUnit Support</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto runs PHPUnit for PHP projects as part of the quality verification pipeline. When
            a repository is configured for PHP, generated test files are executed with PHPUnit
            instead of Jest or Vitest, ensuring the tests are validated using the correct
            language-specific test runner before being committed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">PHP Projects Need the Right Test Runner</h2>
          <p className="text-gray-600 mb-4">
            PHP projects need PHPUnit, not Jest. Without language-specific test runner support, PHP
            test generation would produce unverified code - test files that have never actually been
            executed. The agent would commit PHP tests without knowing whether they pass, leaving
            all verification to the human reviewer and CI.
          </p>
          <p className="text-gray-600 mb-4">
            PHPUnit support ensures PHP projects get the same quality verification that JavaScript
            and TypeScript projects get with Jest/Vitest: tests are run, coverage is collected, and
            failures are caught before the PR is created.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Language-Specific Runners Matter</h2>
          <p className="text-gray-600 mb-4">
            Models can generate PHP test code, but they can&apos;t execute it. A test that looks
            correct to the model might fail due to PHP-specific issues: autoloading paths, namespace
            resolution, or PHPUnit version differences. The only way to know if a PHP test actually
            works is to run it with PHPUnit - something models cannot do on their own.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto detects PHP projects by checking for{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">composer.json</code> and{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">phpunit.xml</code> (or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">phpunit.xml.dist</code>)
            configuration files. Per-repository configuration determines which test runner to use.
            When PHPUnit is selected, GitAuto runs the generated test file with PHPUnit, collects
            the output, and processes pass/fail results the same way it handles Jest/Vitest results.
          </p>
          <p className="text-gray-600 mb-4">
            Coverage collection works through PHPUnit&apos;s built-in coverage reporting, which
            feeds into the same coverage enforcement pipeline used by other test runners.
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
              - runs tests before committing to verify they pass
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - enforces coverage targets using data from PHPUnit runs
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

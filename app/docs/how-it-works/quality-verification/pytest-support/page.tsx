import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function PytestSupportPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.PYTEST_SUPPORT,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">pytest Support</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto runs pytest for Python projects as part of the quality verification pipeline.
            When a repository contains Python test files, generated tests are executed with pytest
            before being committed, ensuring the tests actually pass.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Package Manager Detection</h2>
          <p className="text-gray-600 mb-4">
            Python projects use different package managers. GitAuto detects which one a project uses
            by checking for lock files:{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">poetry.lock</code> for
            Poetry, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">Pipfile.lock</code>{" "}
            for Pipenv, and falls back to pip when no lock file is found. Dependencies are installed
            in an isolated virtual environment and cached on S3 so subsequent runs skip the install
            step.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto detects pytest by looking for the binary in the project&apos;s virtual
            environment ({" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">venv/bin/pytest</code> or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.venv/bin/pytest</code>),
            falling back to the system pytest. It runs only the test files modified in the PR,
            parses the output for failures, and feeds errors back to the model for correction.
          </p>
          <p className="text-gray-600 mb-4">
            Python test files are identified by the{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">test_</code> prefix
            convention (e.g.,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">test_utils.py</code>), which
            differs from the suffix convention used by JavaScript test files.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Dependency Caching</h2>
          <p className="text-gray-600 mb-4">
            When GitAuto first processes a Python repository, it uploads the dependency manifest
            files to S3 and triggers a CodeBuild job that creates a virtual environment, installs
            packages, and tarballs the result. On subsequent runs, GitAuto compares the manifest
            hash and skips the install if dependencies have not changed. The cached virtual
            environment is downloaded and extracted into the clone directory before tests run.
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
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.PHPUNIT_SUPPORT}
                className="text-pink-600 hover:underline"
              >
                PHPUnit Support
              </Link>{" "}
              - equivalent test runner support for PHP projects
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - enforces coverage targets using data from test runs
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

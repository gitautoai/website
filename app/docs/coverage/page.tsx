import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function DocsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Coverage Dashboard</h1>

      <div className="space-y-8">
        <section>
          <p className="text-gray-600 mb-6">
            Learn how to use GitAuto&apos;s Coverage Dashboard to identify and improve low test
            coverage in your codebase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Requirements</h2>
          <p className="text-gray-600 mb-4">To use GitAuto&apos;s coverage analysis:</p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>Coverage report must be in LCOV format</li>
            <li>
              Report file must be named <code>lcov.info</code>
            </li>
            <li>
              Report must be uploaded as GitHub Actions artifact named <code>coverage-report</code>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Supported Frameworks</h2>
          <p className="text-gray-600 mb-4">
            GitAuto is test framework agnostic. Any testing framework that can generate LCOV reports
            is supported. Simply ensure:
          </p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>Coverage report is in LCOV format</li>
            <li>
              Report is saved as <code>coverage/lcov.info</code>
            </li>
            <li>
              Report is uploaded as a GitHub Actions artifact named <code>coverage-report</code>
            </li>
          </ul>

          <p className="text-gray-600 mb-4">
            We provide detailed configuration guides for popular frameworks:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/docs/coverage/javascript"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">JavaScript / TypeScript Testing</h3>
              <p className="text-gray-600">
                Jest, Vitest, and other JavaScript / TypeScript test frameworks
              </p>
            </Link>

            <Link
              href="/docs/coverage/python"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Python Testing</h3>
              <p className="text-gray-600">pytest and other Python test frameworks</p>
            </Link>

            <Link
              href="/docs/coverage/flutter"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Flutter Testing</h3>
              <p className="text-gray-600">Flutter&apos;s built-in test framework</p>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Dashboard Features</h2>
          <p className="text-gray-600 mb-4">From the Coverage Dashboard, you can:</p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>View files with low test coverage</li>
            <li>Select specific files for improvement</li>
            <li>Create GitHub issues individually or in bulk</li>
            <li>Assign issues to GitAuto for automated improvement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Automated Improvements</h2>
          <p className="text-gray-600 mb-4">
            Once issues are created and assigned to GitAuto, it will:
          </p>
          <ol className="list-decimal list-outside space-y-2 text-gray-600 ml-5">
            <li>Analyze the code in files with low coverage</li>
            <li>Generate appropriate test cases</li>
            <li>Create pull requests with the new tests</li>
            <li>Verify coverage improvements</li>
          </ol>
        </section>
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION,
          title: "Installation",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.COVERAGE.JAVASCRIPT,
          title: "JavaScript / TypeScript Coverage",
        }}
      />
    </>
  );
}

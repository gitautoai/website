import Image from "next/image";
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
          <Image
            src="/docs/coverage/coverage-dashboard-sample.png"
            alt="Coverage Dashboard"
            width={1000}
            height={500}
            className="w-full border border-gray-200 rounded-lg"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4 text-left">Requirements</h2>
          <p className="text-gray-600 mb-4">To use GitAuto&apos;s coverage analysis:</p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>Coverage report must be in LCOV format</li>
            <li>
              Report file must be named <code>lcov.info</code>
            </li>
            <li>
              Report must be uploaded as GitHub Actions artifact named <code>coverage-report</code>
            </li>
            <li>Your project uses GitHub (GitAuto is a GitHub App)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Language & Framework Support</h2>
          <p className="text-gray-600 mb-4">
            GitAuto is language and test framework agnostic. Any programming language or testing
            framework that can generate LCOV reports is fully supported.
          </p>

          <p className="text-gray-600 mb-4">
            This means GitAuto works with any language or framework including JavaScript, Python,
            Java, C#, Go, Ruby, PHP, Rust, and many more. Any testing framework that generates LCOV
            reports is supported - Jest, pytest, JUnit, xUnit, Go test, RSpec, PHPUnit, Cargo test,
            and others.
          </p>

          <p className="text-gray-600 mb-4">
            We provide detailed configuration examples for popular combinations to help you get
            started quickly:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/docs/coverage/javascript"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">JavaScript / TypeScript</h3>
              <p className="text-gray-600">
                Jest, Vitest, and other JavaScript / TypeScript test frameworks
              </p>
            </Link>

            <Link
              href="/docs/coverage/python"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Python</h3>
              <p className="text-gray-600">pytest and other Python test frameworks</p>
            </Link>

            <Link
              href="/docs/coverage/flutter"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Flutter</h3>
              <p className="text-gray-600">Flutter&apos;s built-in test framework</p>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4 text-left">Dashboard Features</h2>
          <p className="text-gray-600 mb-4">From the Coverage Dashboard, you can:</p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>View files with low test coverage</li>
            <li>Select specific files for improvement</li>
            <li>Create GitHub issues individually or in bulk</li>
            <li>Assign issues to GitAuto for automated improvement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4 text-left">Automated Improvements</h2>
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

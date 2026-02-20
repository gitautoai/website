import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";

export default function DocsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Coverage Dashboard</h1>

      <div className="space-y-8">
        <section>
          <p className="text-gray-600 mb-6">
            Learn how to use GitAuto&apos;s{" "}
            <Link
              href={RELATIVE_URLS.DASHBOARD.COVERAGE}
              className="text-pink-600 hover:text-pink-700 underline"
            >
              Coverage Dashboard
            </Link>{" "}
            to identify and improve low test coverage in your codebase.
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
              Report file must be named{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">lcov.info</code>
            </li>
            <li>
              Report must be uploaded as GitHub Actions artifact named{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">coverage-report</code>
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
            This means GitAuto works with any language or framework including Python, JavaScript,
            Java, Go, PHP, Ruby, C#, Rust, and many more. Any testing framework that generates LCOV
            reports is supported - pytest, Jest, JaCoCo, go test, PHPUnit, RSpec, xUnit, Cargo test,
            and others.
          </p>

          <p className="text-gray-600 mb-4">
            We provide detailed configuration examples for popular combinations to help you get
            started quickly:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/docs/coverage/python"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Python</h3>
              <p className="text-gray-600">pytest and other Python test frameworks</p>
            </Link>

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
              href="/docs/coverage/java"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Java</h3>
              <p className="text-gray-600">JaCoCo with Maven or Gradle</p>
            </Link>

            <Link
              href="/docs/coverage/go"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Go</h3>
              <p className="text-gray-600">Go&apos;s built-in test coverage tools</p>
            </Link>

            <Link
              href="/docs/coverage/php"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">PHP</h3>
              <p className="text-gray-600">PHPUnit with Xdebug or PCOV</p>
            </Link>

            <Link
              href="/docs/coverage/ruby"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Ruby</h3>
              <p className="text-gray-600">RSpec with SimpleCov</p>
            </Link>

            <Link
              href="/docs/coverage/flutter"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Flutter</h3>
              <p className="text-gray-600">Flutter&apos;s built-in test framework</p>
            </Link>

            <Link
              href="/docs/coverage/multi-language"
              className="block p-6 border rounded-lg hover:border-pink-600"
            >
              <h3 className="text-xl font-semibold mb-2">Multi-Language</h3>
              <p className="text-gray-600">Repositories with multiple languages (e.g., PHP + JS)</p>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4 text-left">Dashboard Features</h2>
          <p className="text-gray-600 mb-4">
            From the{" "}
            <Link
              href={RELATIVE_URLS.DASHBOARD.COVERAGE}
              className="text-pink-600 hover:text-pink-700 underline"
            >
              Coverage Dashboard
            </Link>
            , you can:
          </p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>View files with low test coverage</li>
            <li>Select specific files for improvement</li>
            <li>Create GitHub issues individually or in bulk</li>
            <li>Assign issues to GitAuto for automated improvement</li>
            <li>
              Track progress over time with{" "}
              <Link
                href={RELATIVE_URLS.DOCS.COVERAGE.CHARTS}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Coverage Charts
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4 text-left">Automated Improvements</h2>
          <p className="text-gray-600 mb-4">
            Once issues are created and assigned to GitAuto, it will:
          </p>
          <ol className="list-decimal list-outside space-y-2 text-gray-600 ml-6">
            <li>Analyze the code in files with low coverage</li>
            <li>Generate appropriate test cases</li>
            <li>Create pull requests with the new tests</li>
            <li>Verify coverage improvements</li>
          </ol>
        </section>
      </div>

      <DocsContact
        title="Coverage Reports Not Showing Up?"
        description="Don't worry, we've all been there! LCOV setup can be tricky, and every testing framework has its quirks. Let's get your coverage dashboard populated with real data so you can start improving your tests."
        callToAction="Contact us"
        linkText="and we'll help you debug it together!"
      />

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

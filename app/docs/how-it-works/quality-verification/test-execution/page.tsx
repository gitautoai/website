import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function TestExecutionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TEST_EXECUTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Test Execution</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto runs every generated test file to verify the tests actually pass before
            committing them to the PR. For example, for JavaScript/TypeScript projects, it runs Jest
            or Vitest, collects coverage data during the run, ensures the correct test-specific
            TypeScript config is used, and relaxes lint rules for test files to avoid false
            positives from test-specific patterns like mocks and spies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Tests That Compile but Fail Are Useless</h2>
          <p className="text-gray-600 mb-4">
            A test file that compiles but fails at runtime provides no value. Running the tests
            before committing ensures the PR contains tests that actually work.
          </p>
          <p className="text-gray-600 mb-4">
            Without execution verification, reviewers would open the PR, see green type checks, then
            discover the tests fail when CI runs them. This wastes the reviewer&apos;s time and
            requires another iteration cycle to fix runtime failures.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Why Models Write Tests That Don&apos;t Pass
          </h2>
          <p className="text-gray-600 mb-4">
            Models generate tests based on what the code should do, not what it actually does. If
            the model misunderstands an edge case, the test will assert the wrong behavior. Models
            also hallucinate API shapes - calling methods that don&apos;t exist or passing wrong
            argument types - because they&apos;re predicting based on the function name, not reading
            the actual implementation carefully enough. Code generation benchmarks evaluate the
            implementation code, not the test code, so models are heavily trained to write correct
            implementations but less practiced at writing correct tests that exercise real behavior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto detects which test runner the project uses by checking for configuration files
            and dependencies. For example, for JavaScript/TypeScript it detects Jest or Vitest. It
            runs the generated test file with the appropriate runner, passing flags to collect
            coverage data (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">--coverage</code>) and
            target only the specific test file rather than the entire test suite.
          </p>
          <p className="text-gray-600 mb-4">
            The test tsconfig is used to ensure test-specific path aliases and compiler options are
            respected. If tests fail, the error output is fed back to the model for correction in
            the next iteration. Coverage data from passing tests is forwarded to the coverage
            enforcement step.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Node.js Version Detection</h2>
          <p className="text-gray-600 mb-4">
            Native Node.js addons encode their ABI version at compile time. If the build environment
            compiles modules with one Node version but the test runner uses a different version, tests
            crash with <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">NODE_MODULE_VERSION mismatch</code> errors.
          </p>
          <p className="text-gray-600 mb-4">
            GitAuto detects each repo&apos;s required Node.js version from{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.nvmrc</code>,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.node-version</code>, or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">package.json engines</code>{" "}
            and switches to it at runtime before executing tests. If the upfront detection misses the
            right version, the AI agent can also switch reactively when it encounters ABI mismatch
            errors during test execution.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">MongoDB Binary Pre-Caching</h2>
          <p className="text-gray-600 mb-4">
            Projects using MongoMemoryServer need a MongoDB binary to run tests. By default,
            MongoMemoryServer downloads this binary (~100MB) at runtime on every CI run. GitAuto
            pre-caches the correct binary to S3 during the build phase, so tests start immediately
            without a network download.
          </p>
          <p className="text-gray-600 mb-4">
            The correct binary depends on the MongoDB server version, not the MongoMemoryServer
            package version. MongoDB 7.0+ publishes{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">amazon2023</code> builds
            while 6.0.x only publishes{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">amazon2</code> builds.
            GitAuto detects the repo&apos;s MongoMemoryServer version, maps it to the default
            MongoDB server version, selects the correct distro, and constructs the full archive
            filename for pre-caching.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - enforces coverage targets using data collected from test execution
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TYPE_CHECKING}
                className="text-pink-600 hover:underline"
              >
                Type Checking
              </Link>{" "}
              - catches type errors before tests are executed
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SNAPSHOT_AUTO_UPDATE}
                className="text-pink-600 hover:underline"
              >
                Snapshot Auto-Update
              </Link>{" "}
              - handles snapshot mismatches during test execution
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

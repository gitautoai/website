import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { MultiLanguageChartInfo } from "../MultiLanguageChartInfo";
import { jsWorkflow } from "./code/js-workflow";
import { phpWorkflow } from "./code/php-workflow";
import { workflow } from "./code/workflow";

export default function MultiLanguageCoveragePage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Multi-Language Coverage</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            For repositories with multiple programming languages (e.g., PHP backend + JavaScript
            frontend), GitAuto can track coverage for each language separately. Each language runs
            its own test suite and uploads coverage as a separate artifact.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">How It Works</h3>
            <ul className="list-disc list-outside space-y-1 text-blue-800 ml-5">
              <li>Each language runs tests in a separate CI job</li>
              <li>Each job uploads its coverage with a unique artifact name</li>
              <li>GitAuto processes all coverage artifacts and combines them</li>
              <li>Files are tagged with their detected language based on file extension</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Supported Artifact Patterns</h2>
          <p className="text-gray-600 mb-4">
            GitAuto automatically detects coverage artifacts using these patterns
            (case-insensitive):
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">GitHub Actions</h3>
          <p className="text-gray-600 mb-2">
            Artifact <strong>name</strong> must contain &quot;coverage&quot; or
            &quot;lcov.info&quot;:
          </p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">php-coverage</code>,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">js-coverage</code> - Language prefix
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">coverage-backend</code>,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">coverage-frontend</code> - Coverage
              prefix
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">php-lcov.info</code>,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">js-lcov.info</code> - LCOV suffix
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">coverage-report</code> - Single
              language default
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">CircleCI</h3>
          <p className="text-gray-600 mb-2">
            Artifact <strong>path</strong> must contain &quot;coverage&quot; or
            &quot;lcov.info&quot;:
          </p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">php/lcov.info</code>,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">js/lcov.info</code> - Directory-based
              (recommended)
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">coverage/php/lcov.info</code>,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">coverage/js/lcov.info</code> - Nested
              directories
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">php-coverage/lcov.info</code>,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">js-coverage/lcov.info</code> - Named
              directories
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Workflow Organization</h2>

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-green-900 mb-2">
              Recommended: Separate Workflow Files
            </h3>
            <p className="text-green-800">
              Use separate workflow files with path filters for each language. This saves CI time by
              only running tests when relevant files change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <CodeBlock code={phpWorkflow} language="yaml" filename="php-coverage.yml" />
            <CodeBlock code={jsWorkflow} language="yaml" filename="js-coverage.yml" />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Alternative: Single Workflow File</h3>
          <p className="text-gray-600 mb-4">
            If you prefer a single file, use separate jobs per language. Each job has its own
            isolated workspace, so both can output to the same path (e.g.,{" "}
            <code className="bg-gray-100 px-1">coverage/lcov.info</code>) without conflict - they
            just need unique artifact names:
          </p>
          <CodeBlock code={workflow} language="yaml" filename="coverage.yml" />

          <div className="bg-yellow-50 p-4 rounded-lg mb-6 mt-4">
            <h3 className="text-lg font-medium text-yellow-950 mb-2">Key Points</h3>
            <ul className="list-disc list-outside space-y-1 text-yellow-800 ml-5">
              <li>
                Each job runs in its own workspace - output paths don&apos;t conflict between jobs
              </li>
              <li>
                Artifact names must be unique and contain &quot;coverage&quot; or
                &quot;lcov.info&quot;
              </li>
              <li>Without path filters, both jobs run on every push (less efficient)</li>
            </ul>
          </div>
        </section>

        <MultiLanguageChartInfo linkTo="charts" />

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Language Detection</h2>
          <p className="text-gray-600 mb-4">
            GitAuto automatically detects the language of each file based on its extension within
            the LCOV report:
          </p>
          <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">.php</code> files are tagged as PHP
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">.js</code>,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">.ts</code>,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">.tsx</code> files are tagged as
              JavaScript
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">.py</code> files are tagged as Python
            </li>
          </ul>
          <p className="text-gray-600">
            This means you can filter and view coverage by language in the Coverage Dashboard.
          </p>
        </section>
      </div>

      <DocsContact
        title="Multi-Language Setup Challenges?"
        description="Setting up coverage for multiple languages can be tricky with different test frameworks and output formats. We're happy to help you get everything working together!"
        callToAction="Contact us"
        linkText="and let's get your multi-language coverage set up!"
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW,
          title: "Coverage Overview",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.COVERAGE.CHARTS,
          title: "Coverage Charts",
        }}
      />
    </>
  );
}
